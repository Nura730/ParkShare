import React, { useState, useEffect } from "react";
import {
  getOwnerListings,
  getOwnerEarnings,
  getOwnerAnalytics,
  createListing,
  updateListing,
  deleteListing,
} from "../../services/ownerService";
import "./Owner.css";

const OwnerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({
    parkingName: "",
    address: "",
    locationName: "",
    latitude: "",
    longitude: "",
    pricePerHour: "",
    spaceType: "covered",
    amenities: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listingsRes, earningsRes, analyticsRes] = await Promise.all([
        getOwnerListings(),
        getOwnerEarnings(),
        getOwnerAnalytics(),
      ]);
      setListings(listingsRes.data || []);
      setEarnings(earningsRes.data || {});
      setAnalytics(analyticsRes.data || {});
    } catch (error) {
      console.error("Error fetching owner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const listingData = {
        parking_name: formData.parkingName,
        address: formData.address,
        location_name: formData.locationName,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        price_per_hour: parseFloat(formData.pricePerHour),
        space_type: formData.spaceType,
        amenities: formData.amenities,
      };

      if (editingListing) {
        await updateListing(editingListing.id, listingData);
        alert("Listing updated successfully!");
      } else {
        await createListing(listingData);
        alert("Listing created successfully!");
      }

      setShowAddModal(false);
      setEditingListing(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving listing:", error);
      alert(
        "Failed to save listing: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setFormData({
      parkingName: listing.parking_name,
      address: listing.address,
      locationName: listing.location_name,
      latitude: listing.latitude,
      longitude: listing.longitude,
      pricePerHour: listing.price_per_hour,
      spaceType: listing.space_type,
      amenities: listing.amenities || "",
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;

    try {
      await deleteListing(id);
      alert("Listing deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing");
    }
  };

  const resetForm = () => {
    setFormData({
      parkingName: "",
      address: "",
      locationName: "",
      latitude: "",
      longitude: "",
      pricePerHour: "",
      spaceType: "covered",
      amenities: "",
    });
  };

  if (loading) {
    return (
      <div className="owner-page">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-page">
      <div className="container">
        <h1 className="page-title">🏢 Owner Dashboard</h1>

        {/* Earnings Stats */}
        <div className="stats-grid">
          <div className="stat-card earnings">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>₹{earnings?.totalEarnings?.toFixed(2) || "0.00"}</h3>
              <p>Total Earnings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🅿️</div>
            <div className="stat-content">
              <h3>{listings.length}</h3>
              <p>Active Listings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{analytics?.totalBookings || 0}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>{analytics?.averageRating?.toFixed(1) || "N/A"}</h3>
              <p>Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="section-header">
          <h2>My Parking Listings</h2>
          <button
            className="btn-primary"
            onClick={() => {
              setEditingListing(null);
              resetForm();
              setShowAddModal(true);
            }}
          >
            + Add New Listing
          </button>
        </div>

        <div className="listings-grid">
          {listings.length === 0 ? (
            <div className="empty-state">
              <p>No listings yet. Create your first listing!</p>
            </div>
          ) : (
            listings.map((listing) => (
              <div key={listing.id} className="listing-card">
                <div className="card-header">
                  <h3>{listing.parking_name}</h3>
                  <span
                    className={`status-badge ${listing.availability_status}`}
                  >
                    {listing.availability_status}
                  </span>
                </div>
                <div className="card-body">
                  <p className="address">📍 {listing.address}</p>
                  <p className="location">🏢 {listing.location_name}</p>
                  <div className="details-row">
                    <span className="detail-item">
                      💰 ₹{listing.price_per_hour}/hr
                    </span>
                    <span className="detail-item">🅿️ {listing.space_type}</span>
                  </div>
                  {listing.amenities && (
                    <p className="amenities">✨ {listing.amenities}</p>
                  )}
                </div>
                <div className="card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(listing)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(listing.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowAddModal(false);
              setEditingListing(null);
            }}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingListing ? "Edit Listing" : "Add New Listing"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Parking Name *</label>
                  <input
                    type="text"
                    value={formData.parkingName}
                    onChange={(e) =>
                      setFormData({ ...formData, parkingName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location Name *</label>
                  <input
                    type="text"
                    value={formData.locationName}
                    onChange={(e) =>
                      setFormData({ ...formData, locationName: e.target.value })
                    }
                    placeholder="e.g., Koramangala, Bangalore"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({ ...formData, longitude: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price per Hour (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.pricePerHour}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricePerHour: e.target.value,
                        })
                      }
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Space Type *</label>
                    <select
                      value={formData.spaceType}
                      onChange={(e) =>
                        setFormData({ ...formData, spaceType: e.target.value })
                      }
                    >
                      <option value="covered">Covered</option>
                      <option value="open">Open</option>
                      <option value="underground">Underground</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Amenities</label>
                  <input
                    type="text"
                    value={formData.amenities}
                    onChange={(e) =>
                      setFormData({ ...formData, amenities: e.target.value })
                    }
                    placeholder="e.g., CCTV, Security, 24x7 Access"
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingListing(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingListing ? "Update" : "Create"} Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
