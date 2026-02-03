import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { FiSearch } from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/";

    switch (user.role) {
      case "driver":
        return "/driver/dashboard";
      case "owner":
        return "/owner/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="ParkShare" className="logo-img" />
          <span className="logo-text">ParkShare</span>
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/search" className="nav-link nav-link-search">
              <FiSearch /> Find Parking
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to={getDashboardLink()} className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <span className="user-info glass-card">
                  {user.full_name}{" "}
                  <span className="user-role">({user.role})</span>
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn-logout glass-button"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn-register">
                  Get Started
                </Link>
              </li>
            </>
          )}

          <li>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
