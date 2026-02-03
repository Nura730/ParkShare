const db = require("../config/database");
const { flagSuspiciousListing } = require("../services/misuseDetection");

/**
 * Add new parking listing
 */
exports.addListing = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const {
      title,
      description,
      address,
      latitude,
      longitude,
      price_per_hour,
      total_slots,
      owner_type,
      booking_mode,
      available_hours_start,
      available_hours_end,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !address ||
      !latitude ||
      !longitude ||
      !price_per_hour ||
      !total_slots ||
      !owner_type
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate owner type
    const validOwnerTypes = ["house", "commercial", "parking_area"];
    if (!validOwnerTypes.includes(owner_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid owner type",
      });
    }

    // Create listing
    const [result] = await db.query(
      `INSERT INTO parking_listings 
       (owner_id, title, description, address, latitude, longitude, price_per_hour, 
        total_slots, available_slots, owner_type, booking_mode, available_hours_start, available_hours_end) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        owner_id,
        title,
        description || "",
        address,
        latitude,
        longitude,
        price_per_hour,
        total_slots,
        total_slots, // Initially all slots are available
        owner_type,
        booking_mode || "automatic",
        available_hours_start || "00:00:00",
        available_hours_end || "23:59:59",
      ],
    );

    // Check for suspicious patterns
    const listing = {
      id: result.insertId,
      owner_id,
      title,
      description: description || "",
      price_per_hour,
      total_slots,
      owner_type,
    };

    await flagSuspiciousListing(listing);

    res.status(201).json({
      success: true,
      message: "Parking listing added successfully",
      data: {
        listing_id: result.insertId,
      },
    });
  } catch (error) {
    console.error("Add listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get owner's listings
 */
exports.getOwnerListings = async (req, res) => {
  try {
    const owner_id = req.user.id;

    const [listings] = await db.query(
      `SELECT p.*, 
        (SELECT COUNT(*) FROM bookings WHERE parking_id = p.id) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE parking_id = p.id AND booking_status = 'active') as active_bookings
       FROM parking_listings p
       WHERE p.owner_id = ?
       ORDER BY p.created_at DESC`,
      [owner_id],
    );

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error("Get owner listings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Update listing
 */
exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.user.id;
    const updates = {};

    const allowedUpdates = [
      "title",
      "description",
      "address",
      "price_per_hour",
      "total_slots",
      "booking_mode",
      "available_hours_start",
      "available_hours_end",
      "is_active",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    // Verify ownership
    const [listings] = await db.query(
      "SELECT id FROM parking_listings WHERE id = ? AND owner_id = ?",
      [id, owner_id],
    );

    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or you do not have permission",
      });
    }

    // Update listing
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), id];

    await db.query(
      `UPDATE parking_listings SET ${setClause} WHERE id = ?`,
      values,
    );

    res.json({
      success: true,
      message: "Listing updated successfully",
    });
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Delete listing
 */
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.user.id;

    // Verify ownership
    const [listings] = await db.query(
      "SELECT id FROM parking_listings WHERE id = ? AND owner_id = ?",
      [id, owner_id],
    );

    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or you do not have permission",
      });
    }

    // Check for active bookings
    const [activeBookings] = await db.query(
      'SELECT id FROM bookings WHERE parking_id = ? AND booking_status IN ("active", "confirmed")',
      [id],
    );

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete listing with active bookings",
      });
    }

    // Soft delete (set is_active to false)
    await db.query(
      "UPDATE parking_listings SET is_active = false WHERE id = ?",
      [id],
    );

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get bookings for owner's listings
 */
exports.getOwnerBookings = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const { status } = req.query;

    let query = `
      SELECT b.*, p.title as parking_title, u.email as driver_email, u.full_name as driver_name, u.phone as driver_phone
      FROM bookings b
      JOIN parking_listings p ON b.parking_id = p.id
      JOIN users u ON b.driver_id = u.id
      WHERE p.owner_id = ?
    `;
    const params = [owner_id];

    if (status) {
      query += " AND b.booking_status = ?";
      params.push(status);
    }

    query += " ORDER BY b.created_at DESC";

    const [bookings] = await db.query(query, params);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get owner bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Approve manual booking
 */
exports.approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.user.id;

    // Verify booking belongs to owner's listing
    const [bookings] = await db.query(
      `SELECT b.*, p.available_slots 
       FROM bookings b
       JOIN parking_listings p ON b.parking_id = p.id
       WHERE b.id = ? AND p.owner_id = ?`,
      [id, owner_id],
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or you do not have permission",
      });
    }

    const booking = bookings[0];

    if (booking.booking_status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be approved",
      });
    }

    if (booking.available_slots < 1) {
      return res.status(400).json({
        success: false,
        message: "No available slots",
      });
    }

    // Approve booking
    await db.query(
      'UPDATE bookings SET booking_status = "confirmed" WHERE id = ?',
      [id],
    );

    // Decrease available slots
    await db.query(
      "UPDATE parking_listings SET available_slots = available_slots - 1 WHERE id = ?",
      [booking.parking_id],
    );

    res.json({
      success: true,
      message: "Booking approved successfully",
    });
  } catch (error) {
    console.error("Approve booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Reject manual booking
 */
exports.rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.user.id;

    // Verify booking belongs to owner's listing
    const [bookings] = await db.query(
      `SELECT b.* 
       FROM bookings b
       JOIN parking_listings p ON b.parking_id = p.id
       WHERE b.id = ? AND p.owner_id = ?`,
      [id, owner_id],
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or you do not have permission",
      });
    }

    const booking = bookings[0];

    if (booking.booking_status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be rejected",
      });
    }

    // Reject booking
    await db.query(
      'UPDATE bookings SET booking_status = "cancelled" WHERE id = ?',
      [id],
    );

    res.json({
      success: true,
      message: "Booking rejected successfully",
    });
  } catch (error) {
    console.error("Reject booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get earnings dashboard data
 */
exports.getEarnings = async (req, res) => {
  try {
    const owner_id = req.user.id;

    // Total earnings
    const [totalEarnings] = await db.query(
      `SELECT SUM(b.total_amount) as total_earnings, COUNT(b.id) as total_bookings
       FROM bookings b
       JOIN parking_listings p ON b.parking_id = p.id
       WHERE p.owner_id = ? AND b.payment_status = 'paid'`,
      [owner_id],
    );

    // Earnings by listing
    const [earningsByListing] = await db.query(
      `SELECT 
        p.id,
        p.title,
        COUNT(b.id) as booking_count,
        SUM(b.total_amount) as earnings,
        AVG(b.total_amount) as avg_booking_value
       FROM parking_listings p
       LEFT JOIN bookings b ON p.id = b.parking_id AND b.payment_status = 'paid'
       WHERE p.owner_id = ?
       GROUP BY p.id
       ORDER BY earnings DESC`,
      [owner_id],
    );

    // Recent earnings (last 30 days by day)
    const [recentEarnings] = await db.query(
      `SELECT 
        DATE(b.created_at) as date,
        COUNT(b.id) as bookings,
        SUM(b.total_amount) as earnings
       FROM bookings b
       JOIN parking_listings p ON b.parking_id = p.id
       WHERE p.owner_id = ? 
       AND b.payment_status = 'paid'
       AND b.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(b.created_at)
       ORDER BY date ASC`,
      [owner_id],
    );

    res.json({
      success: true,
      data: {
        total: totalEarnings[0],
        byListing: earningsByListing,
        recent: recentEarnings,
      },
    });
  } catch (error) {
    console.error("Get earnings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
