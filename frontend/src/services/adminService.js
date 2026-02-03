import api from "./api";

// Get all users
export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// Get platform analytics
export const getAnalytics = async () => {
  const response = await api.get("/admin/analytics");
  return response.data;
};

// Get misuse reports
export const getMisuseReports = async () => {
  const response = await api.get("/admin/misuse");
  return response.data;
};

// Update user status
export const updateUserStatus = async (userId, status) => {
  const response = await api.put(`/admin/users/${userId}/status`, { status });
  return response.data;
};

// Resolve misuse report
export const resolveMisuseReport = async (reportId, action) => {
  const response = await api.put(`/admin/misuse/${reportId}/resolve`, {
    action,
  });
  return response.data;
};
