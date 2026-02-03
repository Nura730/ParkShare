import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiMapPin, FiDollarSign, FiClock } from "react-icons/fi";
import "./LeafletMap.css";

// Fix default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom parking marker icon
const parkingIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAzMCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTUgMEMxMC4wMyAwIDYgNC4wMyA2IDlDNiAxNC4yNSAxNSAyNiAxNSAyNkMxNSAyNiAyNCAxNC4yNSAyNCA5QzI0IDQuMDMgMTkuOTcgMCAxNSAwWiIgZmlsbD0iI2VjNDg5OSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iMTQiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+UDwvdGV4dD4KPC9zdmc+",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

const LeafletMap = ({
  center,
  parkingSpots = [],
  onMarkerClick,
  selectedSpot,
}) => {
  return (
    <div className="leaflet-map-container">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="leaflet-map"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current location marker */}
        <Marker position={[center.lat, center.lng]}>
          <Popup>
            <div className="map-popup">
              <strong>📍 Your Location</strong>
            </div>
          </Popup>
        </Marker>

        {/* Parking spot markers */}
        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.latitude, spot.longitude]}
            icon={parkingIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(spot),
            }}
          >
            <Popup>
              <div className="parking-popup">
                <h4>{spot.title || spot.parking_name}</h4>
                <p className="popup-address">
                  <FiMapPin /> {spot.address}
                </p>
                <div className="popup-details">
                  <span className="popup-price">
                    <FiDollarSign /> ₹{spot.price_per_hour}/hr
                  </span>
                  <span className="popup-slots">
                    <FiClock /> {spot.available_slots || 0} slots
                  </span>
                </div>
                {spot.owner_type === "house" && (
                  <div className="popup-badge">🏠 Residential Parking</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="map-legend glass">
        <h4>Legend</h4>
        <div className="legend-item">
          <span className="legend-marker blue">📍</span>
          <span>Your Location</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker pink">P</span>
          <span>Parking Spot</span>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;
