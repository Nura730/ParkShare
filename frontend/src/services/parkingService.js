import api from "./api";

const parkingService = {
  // Search parking
  searchParking: async (lat, lng, filters = {}) => {
    const params = {
      lat,
      lng,
      ...filters,
    };
    const response = await api.get("/parking/search", { params });
    return response.data;
  },

  // Get nearby parking with scoring
  getNearbyParking: async (lat, lng, limit = 10) => {
    const response = await api.get("/parking/nearby", {
      params: { lat, lng, limit },
    });
    return response.data;
  },

  // Get parking details
  getParkingDetails: async (id) => {
    const response = await api.get(`/parking/${id}`);
    return response.data;
  },

  // Get navigation link
  getNavigationLink: async (id) => {
    const response = await api.get(`/parking/${id}/navigation`);
    return response.data;
  },
};

export default parkingService;
