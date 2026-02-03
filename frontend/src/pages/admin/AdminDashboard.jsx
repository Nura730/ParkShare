import React, { useState, useEffect } from "react";
import {
  getUsers,
  getAnalytics,
  getMisuseReports,
  updateUserStatus,
  resolveMisuseReport,
} from "../../services/adminService";
import "./Admin.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [misuseReports, setMisuseReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics"); // analytics, users, misuse

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, analyticsRes, misuseRes] = await Promise.all([
        getUsers(),
        getAnalytics(),
        getMisuseReports(),
      ]);
      setUsers(usersRes.data || []);
      setAnalytics(analyticsRes.data || {});
      setMisuseReports(misuseRes.data || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      alert(`User ${newStatus} successfully!`);
      fetchData();
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }
  };

  const handleResolveMisuse = async (reportId, action) => {
    try {
      await resolveMisuseReport(reportId, action);
      alert("Misuse report resolved!");
      fetchData();
    } catch (error) {
      console.error("Error resolving misuse report:", error);
      alert("Failed to resolve report");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <h1 className="page-title">👨‍💼 Admin Dashboard</h1>

        {/* Analytics Stats */}
        {activeTab === "analytics" && (
          <>
            <div className="stats-grid">
              <div className="stat-card users">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>{analytics.totalUsers || 0}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card listings">
                <div className="stat-icon">🅿️</div>
                <div className="stat-content">
                  <h3>{analytics.totalListings || 0}</h3>
                  <p>Total Listings</p>
                </div>
              </div>
              <div className="stat-card bookings">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>{analytics.totalBookings || 0}</h3>
                  <p>Total Bookings</p>
                </div>
              </div>
              <div className="stat-card revenue">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>₹{analytics.totalRevenue?.toFixed(2) || "0.00"}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
            </div>

            <div className="analytics-details">
              <div className="detail-card">
                <h3>User Distribution</h3>
                <div className="detail-item">
                  <span>Drivers:</span>
                  <span className="value">
                    {analytics.usersByRole?.driver || 0}
                  </span>
                </div>
                <div className="detail-item">
                  <span>Owners:</span>
                  <span className="value">
                    {analytics.usersByRole?.owner || 0}
                  </span>
                </div>
                <div className="detail-item">
                  <span>Admins:</span>
                  <span className="value">
                    {analytics.usersByRole?.admin || 0}
                  </span>
                </div>
              </div>

              <div className="detail-card">
                <h3>Booking Status</h3>
                <div className="detail-item">
                  <span>Confirmed:</span>
                  <span className="value">
                    {analytics.bookingsByStatus?.confirmed || 0}
                  </span>
                </div>
                <div className="detail-item">
                  <span>Completed:</span>
                  <span className="value">
                    {analytics.bookingsByStatus?.completed || 0}
                  </span>
                </div>
                <div className="detail-item">
                  <span>Cancelled:</span>
                  <span className="value">
                    {analytics.bookingsByStatus?.cancelled || 0}
                  </span>
                </div>
              </div>

              <div className="detail-card">
                <h3>Platform Health</h3>
                <div className="detail-item">
                  <span>Active Listings:</span>
                  <span className="value">{analytics.activeListings || 0}</span>
                </div>
                <div className="detail-item">
                  <span>Avg Booking Value:</span>
                  <span className="value">
                    ₹{analytics.averageBookingValue?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="detail-item">
                  <span>Misuse Reports:</span>
                  <span className="value warning">
                    {misuseReports.filter((r) => r.status === "pending").length}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            📊 Analytics
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            👥 Users ({users.length})
          </button>
          <button
            className={activeTab === "misuse" ? "active" : ""}
            onClick={() => setActiveTab("misuse")}
          >
            ⚠️ Misuse Reports (
            {misuseReports.filter((r) => r.status === "pending").length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      {user.status === "active" ? (
                        <button
                          className="btn-action danger"
                          onClick={() =>
                            handleUpdateUserStatus(user.id, "suspended")
                          }
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          className="btn-action success"
                          onClick={() =>
                            handleUpdateUserStatus(user.id, "active")
                          }
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Misuse Reports Tab */}
        {activeTab === "misuse" && (
          <div className="reports-container">
            {misuseReports.length === 0 ? (
              <div className="empty-state">
                <p>No misuse reports found</p>
              </div>
            ) : (
              misuseReports.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <div>
                      <h3>{report.report_type}</h3>
                      <p className="report-id">Report #{report.id}</p>
                    </div>
                    <span className={`status-badge ${report.status}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="report-body">
                    <div className="report-detail">
                      <strong>User:</strong> {report.user_name} (ID:{" "}
                      {report.user_id})
                    </div>
                    {report.booking_id && (
                      <div className="report-detail">
                        <strong>Booking:</strong> #{report.booking_id}
                      </div>
                    )}
                    {report.listing_id && (
                      <div className="report-detail">
                        <strong>Listing:</strong> #{report.listing_id}
                      </div>
                    )}
                    <div className="report-detail">
                      <strong>Description:</strong> {report.description}
                    </div>
                    <div className="report-detail">
                      <strong>Reported:</strong>{" "}
                      {new Date(report.created_at).toLocaleString()}
                    </div>
                    {report.status === "pending" && (
                      <div className="report-actions">
                        <button
                          className="btn-action success"
                          onClick={() =>
                            handleResolveMisuse(report.id, "resolved")
                          }
                        >
                          Resolve
                        </button>
                        <button
                          className="btn-action danger"
                          onClick={() =>
                            handleResolveMisuse(report.id, "action_taken")
                          }
                        >
                          Take Action
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
