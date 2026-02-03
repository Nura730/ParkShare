import React, { useState, useEffect } from "react";
import { getParkingReviews, createReview } from "../services/reviewService";
import { useAuth } from "../context/AuthContext";
import "./Reviews.css";

const Reviews = ({ parkingId }) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [parkingId]);

  const fetchReviews = async () => {
    try {
      const response = await getParkingReviews(parkingId);
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReview(parkingId, rating, comment);
      alert("Review submitted successfully!");
      setShowReviewForm(false);
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  };

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <div className="reviews-summary">
          <h3>Reviews & Ratings</h3>
          {averageRating && (
            <div className="average-rating">
              <span className="rating-number">{averageRating}</span>
              <span className="stars">
                {renderStars(parseFloat(averageRating))}
              </span>
              <span className="total-reviews">({totalReviews} reviews)</span>
            </div>
          )}
        </div>

        {isAuthenticated && user?.role === "driver" && (
          <button
            className="btn-write-review"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel" : "✍️ Write a Review"}
          </button>
        )}
      </div>

      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <div className="rating-input">
            <label>Your Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
          <div className="comment-input">
            <label>Your Review:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="btn-submit-review"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.reviewer_name}</span>
                  <span className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <span className="review-stars">
                  {renderStars(review.rating)}
                </span>
              </div>
              {review.comment && (
                <p className="review-comment">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
