const db = require("../config/database");

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { parkingId, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if user has already reviewed this parking
    const [existingReview] = await db.query(
      "SELECT id FROM reviews WHERE user_id = ? AND parking_id = ?",
      [userId, parkingId],
    );

    if (existingReview.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this parking",
      });
    }

    // Insert review
    const [result] = await db.query(
      "INSERT INTO reviews (user_id, parking_id, rating, comment) VALUES (?, ?, ?, ?)",
      [userId, parkingId, rating, comment || null],
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: {
        id: result.insertId,
        parkingId,
        rating,
        comment,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};

// Get reviews for a parking spot
exports.getParkingReviews = async (req, res) => {
  try {
    const { parkingId } = req.params;

    const [reviews] = await db.query(
      `SELECT r.*, u.full_name as reviewer_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.parking_id = ?
       ORDER BY r.created_at DESC`,
      [parkingId],
    );

    // Calculate average rating
    const [avgResult] = await db.query(
      "SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews FROM reviews WHERE parking_id = ?",
      [parkingId],
    );

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: avgResult[0].average_rating
          ? parseFloat(avgResult[0].average_rating).toFixed(1)
          : null,
        totalReviews: avgResult[0].total_reviews,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const [reviews] = await db.query(
      `SELECT r.*, p.title as parking_name
       FROM reviews r
       JOIN parking_listings p ON r.parking_id = p.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId],
    );

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check ownership
    const [review] = await db.query(
      "SELECT user_id FROM reviews WHERE id = ?",
      [reviewId],
    );

    if (review.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    await db.query("UPDATE reviews SET rating = ?, comment = ? WHERE id = ?", [
      rating,
      comment,
      reviewId,
    ]);

    res.json({
      success: true,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Check ownership
    const [review] = await db.query(
      "SELECT user_id FROM reviews WHERE id = ?",
      [reviewId],
    );

    if (review.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    await db.query("DELETE FROM reviews WHERE id = ?", [reviewId]);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};
