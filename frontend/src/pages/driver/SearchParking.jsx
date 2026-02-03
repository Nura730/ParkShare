import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import parkingService from "../../services/parkingService";
import { createBooking } from "../../services/bookingService";
import LeafletMap from "../../components/LeafletMap";
import { FiMapPin, FiFilter, FiX, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import "./Driver.css";
import "./SearchParking.css";

const SearchParking = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialLocation = queryParams.get("location") || "Bangalore";

  const [locationSearch, setLocationSearch] = useState(initialLocation);
const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: 100,
    ownerType: "all",
    amenities: "",
  });
  const [bookingData, setBookingData] = useState({
    startTime: "",
    endTime: "",
    hours: 1,
  });

  // Predefined locations for demo
  const quickLocations = [
    { name: "Indiranagar", lat: 12.9716, lng: 77.6412 },
    { name: "Koramangala", lat: 12.9352, lng: 77.6245 },
    { name: "MG Road", lat: 12.9759, lng: 77.6061 },
    { name: "Whitefield", lat: 12.9698, lng: 77.75 },
    { name: "Electronic City", lat: 12.8456, lng: 77.6603 },
  ];

 const handleLocationSelect = (location) => {
  setMapCenter([location.lat, location.lng]);
  setLocationSearch(location.name);
  searchParking(location.lat, location.lng);
};


  const searchParking = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await parkingService.getNearbyParking(lat, lng, 20);
      setParkingSpots(response.data || []);
      toast.success(`Found ${response.data?.length || 0} parking spots`);
    } catch (error) {
      console.error("Error searching parking:", error);
      toast.error("Failed to search parking spots");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  searchParking(mapCenter[0], mapCenter[1]);
}, []);


  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot);
  };

  const handleBookNow = (spot) => {
    setSelectedSpot(spot);
    setShowBookingModal(true);
    // Set default times
    const now = new Date();
    const startTime = new Date(now.getTime() + 30 * 60000);
    const endTime = new Date(startTime.getTime() + 60 * 60000);
    setBookingData({
      startTime: startTime.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
      hours: 1,
    });
  };

  const calculateHours = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.max(1, Math.round(diff / (1000 * 60 * 60)));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const hours = calculateHours(bookingData.startTime, bookingData.endTime);
      const totalCost = selectedSpot.price_per_hour * hours;

      const booking = {
        parkingId: selectedSpot.id,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        totalCost,
      };

      await createBooking(booking);
      toast.success("Booking created successfully!");
      setShowBookingModal(false);
      setSelectedSpot(null);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(error.response?.data?.message || "Failed to create booking");
    }
  };

  const filteredSpots = parkingSpots.filter((spot) => {
    if (filters.maxPrice && spot.price_per_hour > filters.maxPrice)
      return false;
    if (filters.ownerType !== "all" && spot.owner_type !== filters.ownerType)
      return false;
    return true;
  });

  return (
    <div className="search-parking-page">
      <Toaster position="top-center" />

      <div className="search-container">
        {/* Search Header */}
        <div className="search-header glass-card">
          <h1 className="gradient-text">Find Your Parking Spot</h1>

          {/* Location Search */}
          <div className="location-search-bar">
            <FiMapPin className="search-icon" />
            <input
              type="text"
              placeholder="Search location..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="glass-input"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle glass-button"
            >
              <FiFilter /> Filters
            </button>
          </div>

          {/* Quick Location Buttons */}
          <div className="quick-locations">
            {quickLocations.map((loc, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(loc)}
                className="quick-location-btn glass-button"
              >
                {loc.name}
              </button>
            ))}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="filters-panel glass"
            >
              <div className="filter-group">
                <label>Max Price (₹/hr):</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                />
                <span>₹{filters.maxPrice}</span>
              </div>
              <div className="filter-group">
                <label>Owner Type:</label>
                <select
                  value={filters.ownerType}
                  onChange={(e) =>
                    setFilters({ ...filters, ownerType: e.target.value })
                  }
                  className="glass-input"
                >
                  <option value="all">All</option>
                  <option value="house">House</option>
                  <option value="commercial">Commercial</option>
                  <option value="parking_area">Parking Area</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Map and Results Layout */}
        <div className="map-results-layout">
          {/* Map Section */}
          <div className="map-section">
            <LeafletMap
              center={mapCenter}
              parkingSpots={filteredSpots}
              onMarkerClick={handleMarkerClick}
              selectedSpot={selectedSpot}
            />
          </div>

          {/* Results Sidebar */}
          <div className="results-sidebar">
            <div className="results-header glass-card">
              <h3>
                {loading
                  ? "Searching..."
                  : `${filteredSpots.length} spots found`}
              </h3>
            </div>

            <div className="parking-list">
              {filteredSpots.map((spot) => (
                <motion.div
                  key={spot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`parking-card-modern glass-card ${selectedSpot?.id === spot.id ? "selected" : ""}`}
                  onClick={() => handleMarkerClick(spot)}
                >
                  <div className="card-header">
                    <h4>{spot.title || spot.parking_name}</h4>
                    <div className="price-badge">₹{spot.price_per_hour}/hr</div>
                  </div>

                  <p className="address-text">
                    <FiMapPin /> {spot.address}
                  </p>

                  <div className="card-info">
                    <span className="info-badge">
                      {spot.available_slots || 0} slots
                    </span>
                    <span className="info-badge">
                      {spot.distance
                        ? `${spot.distance.toFixed(1)} km`
                        : "Nearby"}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookNow(spot);
                    }}
                    className="btn-book-modern"
                  >
                    Book Now →
                  </button>
                </motion.div>
              ))}

              {filteredSpots.length === 0 && !loading && (
                <div className="empty-state glass-card">
                  <FiMapPin className="empty-icon" />
                  <h3>No parking spots found</h3>
                  <p>Try adjusting your search location or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedSpot && (
        <div
          className="modal-overlay-modern"
          onClick={() => setShowBookingModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content-modern glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowBookingModal(false)}
            >
              <FiX />
            </button>

            <h2>Book Parking Spot</h2>
            <h3 className="spot-name">
              {selectedSpot.title || selectedSpot.parking_name}
            </h3>

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>
                  <FiClock /> Start Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.startTime}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      startTime: e.target.value,
                    })
                  }
                  className="glass-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FiClock /> End Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.endTime}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, endTime: e.target.value })
                  }
                  className="glass-input"
                  required
                />
              </div>

              <div className="booking-summary glass">
                <div className="summary-row">
                  <span>Duration:</span>
                  <strong>
                    {calculateHours(bookingData.startTime, bookingData.endTime)}{" "}
                    hour(s)
                  </strong>
                </div>
                <div className="summary-row">
                  <span>Price per hour:</span>
                  <strong>₹{selectedSpot.price_per_hour}</strong>
                </div>
                <div className="summary-row total">
                  <span>Total Cost:</span>
                  <strong className="gradient-text">
                    ₹
                    {selectedSpot.price_per_hour *
                      calculateHours(
                        bookingData.startTime,
                        bookingData.endTime,
                      )}
                  </strong>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary-modern glass-button"
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-modern">
                  Confirm Booking
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SearchParking;
