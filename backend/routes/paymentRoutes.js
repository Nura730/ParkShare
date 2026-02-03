const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

// All payment routes require authentication and driver role
router.post(
  "/simulate",
  auth,
  roleCheck("driver"),
  paymentController.simulatePayment,
);
router.get(
  "/booking/:bookingId",
  auth,
  roleCheck("driver"),
  paymentController.getPaymentByBooking,
);
router.get(
  "/driver",
  auth,
  roleCheck("driver"),
  paymentController.getDriverPayments,
);

module.exports = router;
