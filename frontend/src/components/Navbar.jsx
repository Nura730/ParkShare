import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="ParkShare" className="logo-img" />
          <span className="logo-text">ParkShare</span>
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
          <li>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/search"
              className="nav-link nav-link-search"
              onClick={closeMenu}
            >
              <FiSearch /> Find Parking
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to={getDashboardLink()}
                  className="nav-link"
                  onClick={closeMenu}
                >
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
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="btn-register"
                  onClick={closeMenu}
                >
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
