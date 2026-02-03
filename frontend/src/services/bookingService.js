import api from "./api";

// Create a new booking
export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

// Get driver's bookings
export const getDriverBookings = async () => {
  const response = await api.get("/bookings/driver");
  return response.data;
};

// Complete a booking
export const completeBooking = async (bookingId, actualEndTime) => {
  const response = await api.put(`/bookings/${bookingId}/complete`, {
    actualEndTime,
  });
  return response.data;
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
};
