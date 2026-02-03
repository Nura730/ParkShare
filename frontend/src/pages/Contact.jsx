import React, { useState } from "react";
import { submitContact } from "../services/contactService";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await submitContact(
        formData.name,
        formData.email,
        formData.subject,
        formData.message,
      );
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Get In Touch</h1>
          <p>Have questions? We'd love to hear from you.</p>
        </div>

        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a message</h2>
            {success && (
              <div className="success-message">
                ✅ Thank you for your message! We'll get back to you soon.
              </div>
            )}
            {error && <div className="error-message">❌ {error}</div>}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us more..."
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <h2>Contact Information</h2>

            <div className="info-card">
              <div className="info-icon">📧</div>
              <div className="info-content">
                <h3>Email</h3>
                <p>support@parkshare.com</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📱</div>
              <div className="info-content">
                <h3>Phone</h3>
                <p>+91 1234567890</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <h3>Location</h3>
                <p>Bangalore, India</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">⏰</div>
              <div className="info-content">
                <h3>Support Hours</h3>
                <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
