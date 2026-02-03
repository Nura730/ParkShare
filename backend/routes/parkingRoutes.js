const express = require("express");
const router = express.Router();
const parkingController = require("../controllers/parkingController");

// All parking search routes are public (can view without login)
router.get("/search", parkingController.searchParking);
router.get("/nearby", parkingController.getNearbyParking);
router.get("/:id", parkingController.getParkingDetails);
router.get("/:id/navigation", parkingController.getNavigationLink);

module.exports = router;
