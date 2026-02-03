import React from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { FiMapPin, FiDollarSign, FiClock } from "react-icons/fi";
import "./GoogleMapComponent.css";

const GoogleMapComponent = ({
  center,
  parkingSpots = [],
  onMarkerClick,
  selectedSpot,
  onCloseInfo,
}) => {
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "16px",
  };

  const mapOptions = {
    styles: [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ color: "#242f3e" }],
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#242f3e" }],
      },
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
    ],
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: true,
  };

  // Use demo mode if no API key
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "DEMO_MODE";

  if (apiKey === "DEMO_MODE") {
    return (
      <div className="map-demo-mode glass-card">
        <div className="demo-map-content">
          <FiMapPin className="demo-map-icon" />
          <h3>Google Maps Preview</h3>
          <p>Add your Google Maps API key to see the interactive map</p>
          <div className="demo-locations">
            <h4>Parking Locations:</h4>
            {parkingSpots.map((spot, index) => (
              <div
                key={index}
                className="demo-spot glass"
                onClick={() => onMarkerClick(spot)}
              >
                <div className="spot-header">
                  <strong>{spot.title}</strong>
                  <span className="spot-price">₹{spot.price_per_hour}/hr</span>
                </div>
                <p className="spot-address">{spot.address}</p>
                <div className="spot-info">
                  <span>
                    📍 {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
                  </span>
                  <span className="spot-slots">
                    {spot.available_slots} slots
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="api-key-hint glass">
            <p>💡 To enable maps:</p>
            <ol>
              <li>
                Get API key from{" "}
                <a
                  href="https://console.cloud.google.com/google/maps-apis"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Cloud Console
                </a>
              </li>
              <li>
                Add to <code>frontend/.env</code>:{" "}
                <code>REACT_APP_GOOGLE_MAPS_API_KEY=your_key</code>
              </li>
              <li>Restart frontend</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={mapOptions}
      >
        {/* Current location marker */}
        <Marker
          position={center}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        />

        {/* Parking spot markers */}
        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={{ lat: spot.latitude, lng: spot.longitude }}
            onClick={() => onMarkerClick(spot)}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        ))}

        {/* Info window for selected spot */}
        {selectedSpot && (
          <InfoWindow
            position={{
              lat: selectedSpot.latitude,
              lng: selectedSpot.longitude,
            }}
            onCloseClick={onCloseInfo}
          >
            <div className="map-info-window">
              <h3>{selectedSpot.title}</h3>
              <p className="info-address">{selectedSpot.address}</p>
              <div className="info-details">
                <div className="info-item">
                  <FiDollarSign />
                  <span>₹{selectedSpot.price_per_hour}/hour</span>
                </div>
                <div className="info-item">
                  <FiClock />
                  <span>{selectedSpot.available_slots} slots available</span>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
