const db = require("../config/database");
const {
  getAllMisuseReports,
  checkInactiveListings,
} = require("../services/misuseDetection");
const {
  getPlatformOverview,
  getPeakHours,
  getDemandZones,
  getRevenueTrends,
  getUserActivity,
  getRevenueByParkingType,
} = require("../services/analytics");

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { role, verification_status } = req.query;

    let query =
      "SELECT id, email, full_name, phone, role, verification_status, created_at FROM users WHERE 1=1";
    const params = [];

    if (role) {
      query += " AND role = ?";
      params.push(role);
    }

    if (verification_status) {
      query += " AND verification_status = ?";
      params.push(verification_status);
    }

    query += " ORDER BY created_at DESC";

    const [users] = await db.query(query, params);

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Verify user document
 */
exports.verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { verification_status } = req.body; // 'verified' or 'rejected'

    if (!["verified", "rejected"].includes(verification_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status",
      });
    }

    await db.query("UPDATE users SET verification_status = ? WHERE id = ?", [
      verification_status,
      id,
    ]);

    res.json({
      success: true,
      message: `User ${verification_status} successfully`,
    });
  } catch (error) {
    console.error("Verify user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get all listings
 */
exports.getAllListings = async (req, res) => {
  try {
    const { is_active, owner_type } = req.query;

    let query = `
      SELECT p.*, u.email as owner_email, u.full_name as owner_name
      FROM parking_listings p
      JOIN users u ON p.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (is_active !== undefined) {
      query += " AND p.is_active = ?";
      params.push(is_active === "true" ? 1 : 0);
    }

    if (owner_type) {
      query += " AND p.owner_type = ?";
      params.push(owner_type);
    }

    query += " ORDER BY p.created_at DESC";

    const [listings] = await db.query(query, params);

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error("Get all listings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Flag listing
 */
exports.flagListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Get listing
    const [listings] = await db.query(
      "SELECT * FROM parking_listings WHERE id = ?",
      [id],
    );

    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const listing = listings[0];

    // Create misuse report
    await db.query(
      `INSERT INTO misuse_reports 
       (user_id, report_type, severity, description, auto_detected, admin_reviewed) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        listing.owner_id,
        "fake_listing",
        "medium",
        reason || `Listing "${listing.title}" flagged by admin`,
        false,
        true,
      ],
    );

    // Optionally deactivate listing
    await db.query(
      "UPDATE parking_listings SET is_active = false WHERE id = ?",
      [id],
    );

    res.json({
      success: true,
      message: "Listing flagged and deactivated successfully",
    });
  } catch (error) {
    console.error("Flag listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get misuse reports
 */
exports.getMisuseReports = async (req, res) => {
  try {
    const { reportType, severity, reviewed, limit } = req.query;

    const filters = {
      reportType,
      severity,
      reviewed: reviewed !== undefined ? reviewed === "true" : undefined,
      limit: limit || 100,
    };

    const reports = await getAllMisuseReports(filters);

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Get misuse reports error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Run inactive listings check
 */
exports.runInactiveListingsCheck = async (req, res) => {
  try {
    const result = await checkInactiveListings();

    res.json({
      success: true,
      message: "Inactive listings check completed",
      data: result,
    });
  } catch (error) {
    console.error("Run inactive listings check error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get analytics dashboard
 */
exports.getAnalytics = async (req, res) => {
  try {
    const { period = "daily", days = 30 } = req.query;

    const overview = await getPlatformOverview();
    const peakHours = await getPeakHours();
    const demandZones = await getDemandZones(10);
    const revenueTrends = await getRevenueTrends(period, parseInt(days));
    const userActivity = await getUserActivity(parseInt(days));
    const revenueByType = await getRevenueByParkingType();

    res.json({
      success: true,
      data: {
        overview,
        peakHours,
        demandZones,
        revenueTrends,
        userActivity,
        revenueByType,
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Mark misuse report as reviewed
 */
exports.reviewMisuseReport = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE misuse_reports SET admin_reviewed = true WHERE id = ?",
      [id],
    );

    res.json({
      success: true,
      message: "Misuse report marked as reviewed",
    });
  } catch (error) {
    console.error("Review misuse report error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
