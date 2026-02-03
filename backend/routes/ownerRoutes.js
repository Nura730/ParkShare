const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

// All owner routes require authentication and owner role
router.post("/listings", auth, roleCheck("owner"), ownerController.addListing);
router.get(
  "/listings",
  auth,
  roleCheck("owner"),
  ownerController.getOwnerListings,
);
router.put(
  "/listings/:id",
  auth,
  roleCheck("owner"),
  ownerController.updateListing,
);
router.delete(
  "/listings/:id",
  auth,
  roleCheck("owner"),
  ownerController.deleteListing,
);

router.get(
  "/bookings",
  auth,
  roleCheck("owner"),
  ownerController.getOwnerBookings,
);
router.put(
  "/bookings/:id/approve",
  auth,
  roleCheck("owner"),
  ownerController.approveBooking,
);
router.put(
  "/bookings/:id/reject",
  auth,
  roleCheck("owner"),
  ownerController.rejectBooking,
);

router.get("/earnings", auth, roleCheck("owner"), ownerController.getEarnings);

module.exports = router;
