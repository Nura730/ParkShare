import api from "./api";

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put("/auth/profile", userData);
    return response.data;
  },
};

export default authService;
