const db = require("../config/database");

/**
 * Check for repeated overstays and create misuse report
 */
async function checkRepeatedOverstays(driverId) {
  try {
    // Get bookings from last 30 days
    const [bookings] = await db.query(
      `SELECT * FROM bookings 
       WHERE driver_id = ? 
       AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      [driverId],
    );

    // Count overstays
    const overstayCount = bookings.filter((b) => b.overstay_hours > 0).length;

    if (overstayCount >= 3) {
      const severity = overstayCount >= 5 ? "high" : "medium";

      // Create misuse report
      await db.query(
        `INSERT INTO misuse_reports 
         (user_id, report_type, severity, description, auto_detected) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          driverId,
          "overstay",
          severity,
          `Driver has ${overstayCount} overstays in last 30 days`,
          true,
        ],
      );

      return { flagged: true, overstayCount, severity };
    }

    return { flagged: false, overstayCount };
  } catch (error) {
    console.error("Error checking repeated overstays:", error);
    throw error;
  }
}

/**
 * Check for inactive listings (no bookings in 60 days)
 */
async function checkInactiveListings() {
  try {
    const [listings] = await db.query(
      `SELECT p.*, COUNT(b.id) as booking_count
       FROM parking_listings p
       LEFT JOIN bookings b ON p.id = b.parking_id 
         AND b.created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY)
       WHERE p.is_active = true
       GROUP BY p.id
       HAVING booking_count = 0`,
    );

    const reports = [];

    for (const listing of listings) {
      // Check if report already exists
      const [existing] = await db.query(
        `SELECT id FROM misuse_reports 
         WHERE user_id = ? AND report_type = 'inactive_listing' 
         AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
        [listing.owner_id],
      );

      if (existing.length === 0) {
        await db.query(
          `INSERT INTO misuse_reports 
           (user_id, report_type, severity, description, auto_detected) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            listing.owner_id,
            "inactive_listing",
            "low",
            `Listing "${listing.title}" has no bookings in 60 days`,
            true,
          ],
        );

        reports.push(listing.title);
      }
    }

    return { flaggedCount: reports.length, listings: reports };
  } catch (error) {
    console.error("Error checking inactive listings:", error);
    throw error;
  }
}

/**
 * Detect suspicious listing patterns
 */
function detectSuspiciousListing(listing) {
  let suspicionPoints = 0;
  const reasons = [];

  // Check for unrealistically low price
  if (listing.price_per_hour < 10) {
    suspicionPoints += 2;
    reasons.push("Price unusually low");
  }

  // Check for generic title
  if (listing.title.length < 10) {
    suspicionPoints += 1;
    reasons.push("Title too short");
  }

  // Check for missing or short description
  if (!listing.description || listing.description.length < 20) {
    suspicionPoints += 1;
    reasons.push("Description missing or too short");
  }

  // Check for unrealistic slot count
  if (listing.owner_type === "house" && listing.total_slots > 5) {
    suspicionPoints += 2;
    reasons.push("Unrealistic slot count for house");
  }

  return {
    isSuspicious: suspicionPoints >= 3,
    suspicionPoints,
    reasons: reasons.join(", "),
  };
}

/**
 * Create misuse report for suspicious listing
 */
async function flagSuspiciousListing(listing) {
  try {
    const analysis = detectSuspiciousListing(listing);

    if (analysis.isSuspicious) {
      await db.query(
        `INSERT INTO misuse_reports 
         (user_id, report_type, severity, description, auto_detected) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          listing.owner_id,
          "fake_listing",
          "medium",
          `Listing "${listing.title}" flagged: ${analysis.reasons}`,
          true,
        ],
      );

      return { flagged: true, ...analysis };
    }

    return { flagged: false };
  } catch (error) {
    console.error("Error flagging suspicious listing:", error);
    throw error;
  }
}

/**
 * Get all misuse reports for admin dashboard
 */
async function getAllMisuseReports(filters = {}) {
  try {
    let query = `
      SELECT mr.*, u.email, u.full_name, u.role
      FROM misuse_reports mr
      JOIN users u ON mr.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.reportType) {
      query += ` AND mr.report_type = ?`;
      params.push(filters.reportType);
    }

    if (filters.severity) {
      query += ` AND mr.severity = ?`;
      params.push(filters.severity);
    }

    if (filters.reviewed !== undefined) {
      query += ` AND mr.admin_reviewed = ?`;
      params.push(filters.reviewed);
    }

    query += ` ORDER BY mr.created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT ?`;
      params.push(parseInt(filters.limit));
    }

    const [reports] = await db.query(query, params);
    return reports;
  } catch (error) {
    console.error("Error getting misuse reports:", error);
    throw error;
  }
}

module.exports = {
  checkRepeatedOverstays,
  checkInactiveListings,
  detectSuspiciousListing,
  flagSuspiciousListing,
  getAllMisuseReports,
};
