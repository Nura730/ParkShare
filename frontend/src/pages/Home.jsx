import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiSearch,
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiShield,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import { motion } from "framer-motion";
import "./Home.css";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?location=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/search");
    }
  };

  const platformFeatures = [
    {
      icon: <FiHome />,
      title: "For Homeowners",
      description:
        "Turn your unused parking space into income. No car? List your spot and earn!",
      color: "#ec4899",
      cta: "List Your Space",
    },
    {
      icon: <FiMapPin />,
      title: "For Drivers",
      description:
        "Find affordable residential parking near you. Book house parking at best rates!",
      color: "#6366f1",
      cta: "Find Parking",
    },
    {
      icon: <FiDollarSign />,
      title: "Earn Extra Income",
      description:
        "Homeowners earn ₹3,000-8,000/month by sharing their unused parking space",
      color: "#10b981",
      cta: "See Earnings",
    },
    {
      icon: <FiShield />,
      title: "Safe & Verified",
      description:
        "All homeowners verified. Secure bookings. Insurance included.",
      color: "#06b6d4",
      cta: "Learn More",
    },
  ];

  const howItWorks = {
    forOwners: [
      {
        step: 1,
        title: "List Your Space",
        desc: "Register as owner and add your unused home parking spot with photos",
      },
      {
        step: 2,
        title: "Set Your Price",
        desc: "Choose hourly/monthly rates. Our smart pricing helps maximize earnings",
      },
      {
        step: 3,
        title: "Get Bookings",
        desc: "Drivers book your space. Get paid automatically every month",
      },
    ],
    forDrivers: [
      {
        step: 1,
        title: "Search Location",
        desc: "Find residential parking spots near your destination",
      },
      {
        step: 2,
        title: "Book Instantly",
        desc: "Choose a verified homeowner parking. Book by hour or month",
      },
      {
        step: 3,
        title: "Park and Save",
        desc: "Save up to 60% vs commercial parking. Park at a home!",
      },
    ],
  };

  const stats = [
    { label: "Homeowners Earning", value: "250+", icon: <FiHome /> },
    { label: "Drivers Saving", value: "500+", icon: <FiUsers /> },
    { label: "Revenue Generated", value: "₹5L+", icon: <FiTrendingUp /> },
    { label: "Avg. Monthly Earning", value: "₹5,500", icon: <FiDollarSign /> },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background animated-gradient"></div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-badge glass"
          >
            🏡 India's First Peer-to-Peer Home Parking Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="hero-title"
          >
            Have Unused Parking?
            <span className="gradient-text"> Start Earning Today!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle-large"
          >
            <strong>For Homeowners:</strong> Turn your empty parking space into
            ₹5,000+ monthly income
            <br />
            <strong>For Drivers:</strong> Park at residential homes - Save 60%
            vs commercial lots
          </motion.p>

          {/* Dual CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-dual-cta"
          >
            <Link to="/register?role=owner" className="cta-owner">
              <FiHome /> I Have Parking to Share
            </Link>
            <Link to="/search" className="cta-driver">
              <FiMapPin /> I Need Parking
            </Link>
          </motion.div>

          {/* Quick Search for Drivers */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleSearch}
            className="hero-search glass-card"
          >
            <FiMapPin className="search-icon" />
            <input
              type="text"
              placeholder="Find home parking near you (e.g., Indiranagar, Koramangala)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <FiSearch /> Search
            </button>
          </motion.form>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-stats"
          >
            {stats.map((stat, index) => (
              <div key={index} className="stat-item glass">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="value-prop">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-intro"
          >
            <h2 className="section-title">The Problem We Solve</h2>
            <p className="section-subtitle">
              Millions of homes have <strong>unused parking spaces</strong>{" "}
              while drivers struggle to find affordable parking. We connect
              them!
            </p>
          </motion.div>

          <div className="problem-solution-grid">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="problem-card glass-card"
            >
              <h3>❌ Current Problem</h3>
              <ul>
                <li>Homeowners' parking sits empty (no car)</li>
                <li>Drivers pay ₹100-200/hr for commercial parking</li>
                <li>Wasted space, wasted money</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="solution-card glass-card"
            >
              <h3>✅ ParkShare Solution</h3>
              <ul>
                <li>Homeowners list space → Earn ₹5,000+/month</li>
                <li>Drivers find home parking → Pay ₹20-50/hr</li>
                <li>Win-win for everyone!</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Built for Homeowners & Drivers</h2>
        <div className="features-grid">
          {platformFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="feature-card glass-card"
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <span className="feature-cta" style={{ color: feature.color }}>
                {feature.cta} →
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works - Dual Path */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>

        <div className="dual-journey">
          {/* For Owners */}
          <div className="journey-path">
            <h3 className="journey-title" style={{ color: "#ec4899" }}>
              <FiHome /> For Homeowners
            </h3>
            <div className="steps-container">
              {howItWorks.forOwners.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="step glass-card"
                >
                  <div
                    className="step-number"
                    style={{
                      background: "linear-gradient(135deg, #ec4899, #f43f5e)",
                    }}
                  >
                    {step.step}
                  </div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* For Drivers */}
          <div className="journey-path">
            <h3 className="journey-title" style={{ color: "#6366f1" }}>
              <FiMapPin /> For Drivers
            </h3>
            <div className="steps-container">
              {howItWorks.forDrivers.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="step glass-card"
                >
                  <div
                    className="step-number"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    }}
                  >
                    {step.step}
                  </div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {!isAuthenticated && (
        <section className="cta">
          <div className="cta-content glass-card">
            <h2>Ready to Join the Community?</h2>
            <p className="cta-dual-message">
              <strong>Homeowners:</strong> Start earning from your empty parking
              spot today
              <br />
              <strong>Drivers:</strong> Find affordable home parking near you
            </p>
            <div className="cta-buttons">
              <Link to="/register?role=owner" className="btn-cta-primary">
                🏠 List My Parking Space
              </Link>
              <Link
                to="/register?role=driver"
                className="btn-cta-secondary glass-button"
              >
                🚗 Find Parking Near Me
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Demo Notice */}
      <section className="demo-notice">
        <div className="glass-card">
          <p>
            ⚠️ <strong>Demo Platform</strong> - Payment processing simulated.
            Fully functional peer-to-peer parking marketplace.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
