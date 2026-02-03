const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const reviewController = require("../controllers/reviewController");

// Create a review (authenticated users)
router.post("/", verifyToken, reviewController.createReview);

// Get reviews for a parking spot (public)
router.get("/parking/:parkingId", reviewController.getParkingReviews);

// Get user's reviews (authenticated)
router.get("/user", verifyToken, reviewController.getUserReviews);

// Update a review (authenticated, own reviews only)
router.put("/:reviewId", verifyToken, reviewController.updateReview);

// Delete a review (authenticated, own reviews only)
router.delete("/:reviewId", verifyToken, reviewController.deleteReview);

module.exports = router;
