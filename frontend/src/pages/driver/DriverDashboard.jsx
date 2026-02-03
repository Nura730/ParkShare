import React, { useState, useEffect } from "react";
import {
  getDriverBookings,
  completeBooking,
} from "../../services/bookingService";
import "./Driver.css";

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, completed

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getDriverBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    if (!window.confirm("Mark this booking as completed?")) return;

    try {
      const actualEndTime = new Date().toISOString();
      await completeBooking(bookingId, actualEndTime);
      alert("Booking completed successfully!");
      fetchBookings();
    } catch (error) {
      console.error("Error completing booking:", error);
      alert("Failed to complete booking");
    }
  };

  const getFilteredBookings = () => {
    if (filter === "active") {
      return bookings.filter((b) => b.status === "confirmed");
    } else if (filter === "completed") {
      return bookings.filter((b) => b.status === "completed");
    }
    return bookings;
  };

  const getStats = () => {
    return {
      total: bookings.length,
      active: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      totalSpent: bookings
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + parseFloat(b.total_cost || 0), 0),
    };
  };

  const stats = getStats();
  const filteredBookings = getFilteredBookings();

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1 className="page-title">🚗 My Bookings</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          <div className="stat-card active">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.active}</h3>
              <p>Active Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎉</div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>₹{stats.totalSpent.toFixed(2)}</h3>
              <p>Total Spent</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "active" ? "active" : ""}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <p>No bookings found</p>
              <a href="/search" className="btn-primary">
                Search Parking
              </a>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.parking_name}</h3>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-body">
                  <p>📍 {booking.address}</p>
                  <div className="booking-details">
                    <div className="detail-item">
                      <span className="label">Start:</span>
                      <span>
                        {new Date(booking.start_time).toLocaleString()}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">End:</span>
                      <span>{new Date(booking.end_time).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Cost:</span>
                      <span className="highlight">₹{booking.total_cost}</span>
                    </div>
                    {booking.extra_charge > 0 && (
                      <div className="detail-item warning">
                        <span className="label">Extra Charge:</span>
                        <span>₹{booking.extra_charge}</span>
                      </div>
                    )}
                  </div>
                  {booking.status === "confirmed" && (
                    <button
                      className="btn-complete"
                      onClick={() => handleCompleteBooking(booking.id)}
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
