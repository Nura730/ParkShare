import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LeafletMap = ({
  center = [12.9716, 77.5946],
  parkingSpots = [],
  onMarkerClick,
  selectedSpot,
}) => {
  const safeCenter =
    Array.isArray(center) &&
    center.length === 2 &&
    typeof center[0] === "number" &&
    typeof center[1] === "number"
      ? center
      : [12.9716, 77.5946];

  return (
    <MapContainer
      center={safeCenter}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location */}
      <Marker position={safeCenter}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Parking markers */}
      {parkingSpots
        .filter(
          (p) =>
            typeof p.latitude === "number" &&
            typeof p.longitude === "number"
        )
        .map((p) => (
          <Marker
            key={p.id}
            position={[p.latitude, p.longitude]}
            eventHandlers={{
              click: () => onMarkerClick(p),
            }}
          >
            <Popup>
              <strong>{p.title || p.parking_name}</strong>
              <br />
              ₹{p.price_per_hour}/hr
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default LeafletMap;
