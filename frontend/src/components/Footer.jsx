import React, { useState } from "react";
import { Link } from "react-router-dom";
import { subscribeNewsletter } from "../services/contactService";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await subscribeNewsletter(email);
      setMessage(response.message);
      setEmail("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo.png" alt="ParkShare" />
              <h3>ParkShare</h3>
            </div>
            <p className="footer-description">
              Connecting drivers with unused parking spaces for a smarter, more
              efficient urban parking solution.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/search">Find Parking</Link>
              </li>
              <li>
                <Link to="/register">Get Started</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div className="footer-section">
            <h4>For Users</h4>
            <ul className="footer-links">
              <li>
                <Link to="/driver/dashboard">Driver Dashboard</Link>
              </li>
              <li>
                <Link to="/owner/dashboard">Owner Dashboard</Link>
              </li>
              <li>
                <Link to="/login">Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h4>Stay Updated</h4>
            <p className="newsletter-description">
              Subscribe to get updates on new features and parking deals.
            </p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "..." : "→"}
              </button>
            </form>
            {message && <p className="newsletter-message">{message}</p>}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} ParkShare. All rights reserved.
          </p>
          <p className="demo-note">
            Payment simulation for demo purposes. Portfolio/demo project
            showcasing full-stack development.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
