import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiUser, FiPhone, FiUserPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "driver",
    verification_doc_url: "",
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = { ...formData };

      // For owners, add mock document URL
      if (formData.role === "owner" && !formData.verification_doc_url) {
        dataToSubmit.verification_doc_url =
          "mock_document_" + Date.now() + ".pdf";
      }

      const response = await register(dataToSubmit);
      const role = response.data.user.role;

      toast.success(
        `Account created! Welcome, ${response.data.user.full_name}!`,
      );

      // Redirect based on role
      setTimeout(() => {
        switch (role) {
          case "driver":
            navigate("/driver/dashboard");
            break;
          case "owner":
            navigate("/owner/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
        }
      }, 500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Toaster position="top-center" />
      <div className="auth-background animated-gradient"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-box glass-card"
        style={{ maxWidth: "520px" }}
      >
        <div className="auth-header">
          <FiUserPlus className="auth-icon" />
          <h2>Join ParkShare</h2>
          <p className="auth-subtitle">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>
              <FiUser /> Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="glass-input"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FiMail /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="glass-input"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FiPhone /> Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="glass-input"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FiLock /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              className="glass-input"
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>I want to:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="glass-input"
            >
              <option value="driver">🚗 Find Parking (Driver)</option>
              <option value="owner">🏠 List My Parking (Owner)</option>
            </select>
          </div>

          {formData.role === "owner" && (
            <div className="info-box glass">
              <p>
                📄 <strong>Document Verification:</strong> For demo purposes,
                verification is automatic. In production, you would upload
                property documents here.
              </p>
            </div>
          )}

          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
