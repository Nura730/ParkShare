import React, { useState, useEffect } from "react";
import {
  getOwnerListings,
  getOwnerEarnings,
  getOwnerAnalytics,
} from "../../services/ownerService";
import "./Owner.css";

const OwnerDashboard = () => {
  //const { user } = useAuth();

  // Backend data (read-only)
  const [backendListings, setBackendListings] = useState([]);
  const [earnings, setEarnings] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  // Demo (local) data – USED FOR CREATE / EDIT / DELETE
  const [demoListings, setDemoListings] = useState([]);

  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  const [formData, setFormData] = useState({
    parkingName: "",
    address: "",
    locationName: "",
    latitude: "",
    longitude: "",
    pricePerHour: "",
    availableSlots: "",
    spaceType: "covered",
    amenities: "",
  });

  // Load backend data (safe even if backend is partial)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [lRes, eRes, aRes] = await Promise.all([
          getOwnerListings().catch(() => ({ data: [] })),
          getOwnerEarnings().catch(() => ({ data: {} })),
          getOwnerAnalytics().catch(() => ({ data: {} })),
        ]);

        setBackendListings(lRes.data || []);
        setEarnings(eRes.data || {});
        setAnalytics(aRes.data || {});
      } catch (err) {
        console.error("Owner dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use demo listings if available, else backend listings
  const listings =
    demoListings.length > 0 ? demoListings : backendListings;

  const resetForm = () => {
    setFormData({
      parkingName: "",
      address: "",
      locationName: "",
      latitude: "",
      longitude: "",
      pricePerHour: "",
      availableSlots: "",
      spaceType: "covered",
      amenities: "",
    });
  };

  // CREATE / UPDATE (DEMO MODE)
  const handleSubmit = (e) => {
    e.preventDefault();

    const newListing = {
      id: editingListing?.id || Date.now(),
      parking_name: formData.parkingName,
      address: formData.address,
      location_name: formData.locationName,
      latitude: formData.latitude,
      longitude: formData.longitude,
      price_per_hour: formData.pricePerHour,
      available_slots: formData.availableSlots,
      space_type: formData.spaceType,
      amenities: formData.amenities,
      availability_status: "available",
    };

    if (editingListing) {
      setDemoListings((prev) =>
        prev.map((l) => (l.id === editingListing.id ? newListing : l))
      );
    } else {
      setDemoListings((prev) => [...prev, newListing]);
    }

    setShowAddModal(false);
    setEditingListing(null);
    resetForm();
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
      availableSlots: listing.available_slots,
      spaceType: listing.space_type,
      amenities: listing.amenities || "",
    });
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this listing?")) return;
    setDemoListings((prev) => prev.filter((l) => l.id !== id));
  };

  if (loading) {
    return (
      <div className="owner-page">
        <div className="loading">Loading…</div>
      </div>
    );
  }

  return (
    <div className="owner-page">
      <div className="container">
        <h1>🏢 Owner Dashboard</h1>

        {/* DEMO TAGLINE (IMPORTANT FOR IBM) */}
        <p className="demo-tagline">
          ⚠️ Demo Prototype: This project demonstrates the real-world idea and
          UI workflow of parking sharing. Data persistence and advanced backend
          logic are simplified for demonstration purposes.
        </p>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>₹{earnings?.totalEarnings || 0}</h3>
            <p>Total Earnings</p>
          </div>
          <div className="stat-card">
            <h3>{listings.length}</h3>
            <p>Listings</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.totalBookings || 0}</h3>
            <p>Bookings</p>
          </div>
        </div>

        {/* LISTINGS */}
        <div className="section-header">
          <h2>My Listings</h2>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setEditingListing(null);
              setShowAddModal(true);
            }}
          >
            + Add Listing
          </button>
        </div>

        <div className="listings-grid">
          {listings.length === 0 && (
            <p>No listings yet. Add your first parking space.</p>
          )}

          {listings.map((l) => (
            <div key={l.id} className="listing-card">
              <h3>{l.parking_name}</h3>
              <p>📍 {l.address}</p>
              <p>₹{l.price_per_hour}/hr</p>
              <p>Slots: {l.available_slots}</p>
              <p>Type: {l.space_type}</p>

              <div className="card-actions">
                <button onClick={() => handleEdit(l)}>Edit</button>
                <button onClick={() => handleDelete(l.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {showAddModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{editingListing ? "Edit" : "Create"} Listing</h2>

              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Parking Name"
                  value={formData.parkingName}
                  onChange={(e) =>
                    setFormData({ ...formData, parkingName: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="Location Name"
                  value={formData.locationName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      locationName: e.target.value,
                    })
                  }
                  required
                />
                <input
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="Price per Hour"
                  value={formData.pricePerHour}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricePerHour: e.target.value,
                    })
                  }
                  required
                />
                <input
                  placeholder="Available Slots"
                  value={formData.availableSlots}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availableSlots: e.target.value,
                    })
                  }
                  required
                />

                <select
                  value={formData.spaceType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      spaceType: e.target.value,
                    })
                  }
                >
                  <option value="covered">Covered</option>
                  <option value="open">Open</option>
                  <option value="underground">Underground</option>
                </select>

                <input
                  placeholder="Amenities"
                  value={formData.amenities}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amenities: e.target.value,
                    })
                  }
                />

                <button type="submit" className="btn-primary">
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
