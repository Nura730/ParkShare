import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import SearchParking from "./pages/driver/SearchParking";
import DriverDashboard from "./pages/driver/DriverDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Components
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchParking />} />

            {/* Driver Routes */}
            <Route
              path="/driver/dashboard"
              element={
                <ProtectedRoute allowedRoles={["driver"]}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />

            {/* Owner Routes */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

const NotFound = () => (
  <div className="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/">Go Home</a>
  </div>
);

export default App;
