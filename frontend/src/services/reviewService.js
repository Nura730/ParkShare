import api from "./api";

// Submit a review
export const createReview = async (parkingId, rating, comment) => {
  const response = await api.post("/reviews", {
    parkingId,
    rating,
    comment,
  });
  return response.data;
};

// Get reviews for a parking spot
export const getParkingReviews = async (parkingId) => {
  const response = await api.get(`/reviews/parking/${parkingId}`);
  return response.data;
};

// Get user's reviews
export const getUserReviews = async () => {
  const response = await api.get("/reviews/user");
  return response.data;
};

// Update a review
export const updateReview = async (reviewId, rating, comment) => {
  const response = await api.put(`/reviews/${reviewId}`, {
    rating,
    comment,
  });
  return response.data;
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};
