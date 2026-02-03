import api from "./api";

// Get owner's parking listings
export const getOwnerListings = async () => {
  const response = await api.get("/owner/listings");
  return response.data;
};

// Create a new parking listing
export const createListing = async (listingData) => {
  const response = await api.post("/owner/listings", listingData);
  return response.data;
};

// Update a parking listing
export const updateListing = async (listingId, listingData) => {
  const response = await api.put(`/owner/listings/${listingId}`, listingData);
  return response.data;
};

// Delete a parking listing
export const deleteListing = async (listingId) => {
  const response = await api.delete(`/owner/listings/${listingId}`);
  return response.data;
};

// Get owner's bookings for their listings
export const getOwnerBookings = async () => {
  const response = await api.get("/owner/bookings");
  return response.data;
};

// Get owner's earnings
export const getOwnerEarnings = async () => {
  const response = await api.get("/owner/earnings");
  return response.data;
};

// Get owner's analytics
export const getOwnerAnalytics = async () => {
  const response = await api.get("/owner/analytics");
  return response.data;
};
