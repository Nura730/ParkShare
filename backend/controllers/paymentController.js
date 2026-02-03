const db = require("../config/database");

/**
 * Simulate payment for a booking
 */
exports.simulatePayment = async (req, res) => {
  try {
    const { booking_id, payment_method = "dummy_card" } = req.body;
    const driver_id = req.user.id;

    // Validate input
    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    // Get booking
    const [bookings] = await db.query(
      "SELECT * FROM bookings WHERE id = ? AND driver_id = ?",
      [booking_id, driver_id],
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookings[0];

    // Check if already paid
    if (booking.payment_status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Booking already paid",
      });
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate payment success (90% success rate)
    const isSuccess = Math.random() > 0.1;
    const payment_status = isSuccess ? "success" : "failed";

    // Generate dummy transaction ID
    const transaction_id = `DUMMY_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create payment record
    const [paymentResult] = await db.query(
      `INSERT INTO payments 
       (booking_id, amount, payment_method, transaction_id, payment_status, is_dummy) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        booking_id,
        booking.total_amount,
        payment_method,
        transaction_id,
        payment_status,
        true,
      ],
    );

    // If successful, update booking payment status
    if (isSuccess) {
      await db.query(
        'UPDATE bookings SET payment_status = "paid", booking_status = "active" WHERE id = ?',
        [booking_id],
      );
    }

    res.json({
      success: isSuccess,
      message: isSuccess
        ? "⚠️ Payment simulated successfully (Demo mode - No real money charged)"
        : "⚠️ Payment simulation failed (Demo mode)",
      data: {
        payment_id: paymentResult.insertId,
        transaction_id,
        amount: booking.total_amount,
        payment_method,
        payment_status,
        is_dummy: true,
        disclaimer:
          "This is a simulated payment for demo purposes only. No real money is processed.",
      },
    });
  } catch (error) {
    console.error("Simulate payment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during payment simulation",
    });
  }
};

/**
 * Get payment details for a booking
 */
exports.getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const driver_id = req.user.id;

    // Verify booking belongs to driver
    const [bookings] = await db.query(
      "SELECT id FROM bookings WHERE id = ? AND driver_id = ?",
      [bookingId, driver_id],
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Get payment
    const [payments] = await db.query(
      "SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC",
      [bookingId],
    );

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get all payments for current user (driver)
 */
exports.getDriverPayments = async (req, res) => {
  try {
    const driver_id = req.user.id;

    const [payments] = await db.query(
      `SELECT p.*, b.parking_id, b.start_time, b.end_time, b.booked_hours
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       WHERE b.driver_id = ?
       ORDER BY p.created_at DESC`,
      [driver_id],
    );

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Get driver payments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
