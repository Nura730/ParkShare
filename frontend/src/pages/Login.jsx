import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      const role = response.data.user.role;

      toast.success(`Welcome back, ${response.data.user.full_name}!`);

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
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick login helpers for demo
  const quickLogin = (email, password, role) => {
    setFormData({ email, password });
    toast.success(`Demo ${role} credentials loaded!`, { icon: "🎭" });
  };

  const demoAccounts = [
    {
      email: "driver1@example.com",
      password: "password123",
      role: "Driver",
      color: "#6366f1",
    },
    {
      email: "owner1@example.com",
      password: "password123",
      role: "Owner",
      color: "#ec4899",
    },
    {
      email: "admin@parkshare.com",
      password: "password123",
      role: "Admin",
      color: "#06b6d4",
    },
  ];

  return (
    <div className="auth-container">
      <Toaster position="top-center" />
      <div className="auth-background animated-gradient"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-box glass-card"
      >
        <div className="auth-header">
          <FiUser className="auth-icon" />
          <h2>Welcome Back!</h2>
          <p className="auth-subtitle">Login to ParkShare</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
              <FiLock /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="glass-input"
              required
            />
          </div>

          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="demo-credentials glass">
          <h4>🎭 Quick Demo Login</h4>
          <div className="demo-buttons">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() =>
                  quickLogin(account.email, account.password, account.role)
                }
                className="btn-demo glass-button"
                style={{ borderColor: account.color }}
              >
                <span style={{ color: account.color }}>●</span> {account.role}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
