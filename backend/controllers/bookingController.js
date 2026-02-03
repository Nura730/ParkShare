const db = require("../config/database");
const { detectOverstay } = require("../services/smartLogic");
const { checkRepeatedOverstays } = require("../services/misuseDetection");

/**
 * Create a new booking
 */
exports.createBooking = async (req, res) => {
  try {
    const { parking_id, start_time, booked_hours } = req.body;
    const driver_id = req.user.id;

    // Validate input
    if (!parking_id || !start_time || !booked_hours) {
      return res.status(400).json({
        success: false,
        message: "Please provide parking_id, start_time, and booked_hours",
      });
    }

    // Get parking details
    const [parkings] = await db.query(
      "SELECT * FROM parking_listings WHERE id = ? AND is_active = true",
      [parking_id],
    );

    if (parkings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parking not found or inactive",
      });
    }

    const parking = parkings[0];

    // Check availability
    if (parking.available_slots < 1) {
      return res.status(400).json({
        success: false,
        message: "No available slots",
      });
    }

    // Calculate end time and amount
    const startTime = new Date(start_time);
    const endTime = new Date(
      startTime.getTime() + booked_hours * 60 * 60 * 1000,
    );
    const base_amount = parking.price_per_hour * booked_hours;

    // Determine initial booking status based on booking mode
    const booking_status =
      parking.booking_mode === "automatic" ? "confirmed" : "pending";

    // Create booking
    const [result] = await db.query(
      `INSERT INTO bookings 
       (parking_id, driver_id, booking_status, start_time, end_time, booked_hours, base_amount, total_amount) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parking_id,
        driver_id,
        booking_status,
        startTime,
        endTime,
        booked_hours,
        base_amount,
        base_amount,
      ],
    );

    // If automatic booking, decrease available slots
    if (booking_status === "confirmed") {
      await db.query(
        "UPDATE parking_listings SET available_slots = available_slots - 1 WHERE id = ?",
        [parking_id],
      );
    }

    res.status(201).json({
      success: true,
      message:
        booking_status === "confirmed"
          ? "Booking confirmed successfully"
          : "Booking created, awaiting owner approval",
      data: {
        booking_id: result.insertId,
        booking_status,
        start_time: startTime,
        end_time: endTime,
        base_amount,
        requires_payment: booking_status === "confirmed",
      },
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get driver's bookings
 */
exports.getDriverBookings = async (req, res) => {
  try {
    const driver_id = req.user.id;
    const { status } = req.query;

    let query = `
      SELECT b.*, p.title, p.address, p.latitude, p.longitude, p.price_per_hour
      FROM bookings b
      JOIN parking_listings p ON b.parking_id = p.id
      WHERE b.driver_id = ?
    `;
    const params = [driver_id];

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
    console.error("Get driver bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Complete booking (driver ends parking)
 */
exports.completeBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const driver_id = req.user.id;
    const { actual_end_time } = req.body;

    // Get booking
    const [bookings] = await db.query(
      "SELECT * FROM bookings WHERE id = ? AND driver_id = ?",
      [id, driver_id],
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookings[0];

    if (booking.booking_status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Booking already completed",
      });
    }

    // Set actual end time
    booking.actual_end_time = actual_end_time || new Date();

    // Detect overstay
    const overstayResult = detectOverstay(booking);

    // Update booking
    await db.query(
      `UPDATE bookings 
       SET booking_status = 'completed', 
           actual_end_time = ?,
           overstay_hours = ?,
           overstay_amount = ?,
           total_amount = ?
       WHERE id = ?`,
      [
        booking.actual_end_time,
        overstayResult.overstayHours,
        overstayResult.overstayAmount,
        overstayResult.totalAmount,
        id,
      ],
    );

    // Increase available slots
    await db.query(
      "UPDATE parking_listings SET available_slots = available_slots + 1 WHERE id = ?",
      [booking.parking_id],
    );

    // Check for repeated overstays (misuse detection)
    if (overstayResult.hasOverstay) {
      await checkRepeatedOverstays(driver_id);
    }

    res.json({
      success: true,
      message: "Booking completed successfully",
      data: {
        booking_id: id,
        hasOverstay: overstayResult.hasOverstay,
        overstayHours: overstayResult.overstayHours,
        overstayAmount: overstayResult.overstayAmount,
        totalAmount: overstayResult.totalAmount,
        requiresAdditionalPayment: overstayResult.hasOverstay,
      },
    });
  } catch (error) {
    console.error("Complete booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Cancel booking
 */
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const driver_id = req.user.id;

    // Get booking
    const [bookings] = await db.query(
      "SELECT * FROM bookings WHERE id = ? AND driver_id = ?",
      [id, driver_id],
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookings[0];

    if (
      booking.booking_status === "completed" ||
      booking.booking_status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel this booking",
      });
    }

    // Update booking status
    await db.query(
      'UPDATE bookings SET booking_status = "cancelled" WHERE id = ?',
      [id],
    );

    // If booking was confirmed, increase available slots
    if (
      booking.booking_status === "confirmed" ||
      booking.booking_status === "active"
    ) {
      await db.query(
        "UPDATE parking_listings SET available_slots = available_slots + 1 WHERE id = ?",
        [booking.parking_id],
      );
    }

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
