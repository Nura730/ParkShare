const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./routes/authRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const adminRoutes = require("./routes/adminRoutes");
// Temporarily disabled until database tables are created
// const reviewRoutes = require("./routes/reviewRoutes");
// const contactRoutes = require("./routes/contactRoutes");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
// Temporarily disabled until database tables are created
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/contact", contactRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ParkShare API is running",
    timestamp: new Date().toISOString(),
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Smart Parking Share API",
    version: "1.0.0",
    description: "IBM Skills Development Demo Project",
    endpoints: {
      auth: "/api/auth",
      parking: "/api/parking",
      bookings: "/api/bookings",
      payments: "/api/payments",
      owner: "/api/owner",
      admin: "/api/admin",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("========================================");
  console.log("🚗 Smart Parking Share API");
  console.log("========================================");
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📚 Welcome page: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log("========================================");
  console.log("⚠️  DEMO MODE - For IBM Skills Development");
  console.log("========================================");
});

module.exports = app;
