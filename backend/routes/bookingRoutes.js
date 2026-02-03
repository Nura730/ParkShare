const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

// All booking routes require authentication
// Only drivers can create and manage bookings
router.post("/", auth, roleCheck("driver"), bookingController.createBooking);
router.get(
  "/driver",
  auth,
  roleCheck("driver"),
  bookingController.getDriverBookings,
);
router.put(
  "/:id/complete",
  auth,
  roleCheck("driver"),
  bookingController.completeBooking,
);
router.put(
  "/:id/cancel",
  auth,
  roleCheck("driver"),
  bookingController.cancelBooking,
);

module.exports = router;
