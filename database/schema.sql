-- ============================================
-- ParkShare Platform - Database Schema
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS parkshare;
USE parkshare;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS misuse_reports;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS parking_listings;
DROP TABLE IF EXISTS users;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role ENUM('driver', 'owner', 'admin') NOT NULL,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  verification_doc_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_verification (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Parking Listings Table
-- ============================================
CREATE TABLE parking_listings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  owner_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  price_per_hour DECIMAL(10, 2) NOT NULL,
  total_slots INT DEFAULT 1,
  available_slots INT DEFAULT 1,
  owner_type ENUM('house', 'commercial', 'parking_area') NOT NULL,
  booking_mode ENUM('automatic', 'manual') DEFAULT 'automatic',
  available_hours_start TIME DEFAULT '00:00:00',
  available_hours_end TIME DEFAULT '23:59:59',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_owner (owner_id),
  INDEX idx_location (latitude, longitude),
  INDEX idx_active (is_active),
  INDEX idx_price (price_per_hour)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bookings Table
-- ============================================
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parking_id INT NOT NULL,
  driver_id INT NOT NULL,
  booking_status ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled') NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  actual_end_time DATETIME,
  booked_hours INT NOT NULL,
  base_amount DECIMAL(10, 2) NOT NULL,
  overstay_hours INT DEFAULT 0,
  overstay_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parking_id) REFERENCES parking_listings(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_parking (parking_id),
  INDEX idx_driver (driver_id),
  INDEX idx_status (booking_status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_start_time (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Payments Table
-- ============================================
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100),
  payment_status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  is_dummy BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_booking (booking_id),
  INDEX idx_transaction (transaction_id),
  INDEX idx_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Misuse Reports Table
-- ============================================
CREATE TABLE misuse_reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  report_type ENUM('overstay', 'fake_listing', 'inactive_listing') NOT NULL,
  severity ENUM('low', 'medium', 'high') DEFAULT 'low',
  description TEXT,
  auto_detected BOOLEAN DEFAULT FALSE,
  admin_reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_type (report_type),
  INDEX idx_severity (severity),
  INDEX idx_reviewed (admin_reviewed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Success Message
-- ============================================
SELECT 'Database schema created successfully!' AS message;
SELECT 'Tables created:' AS info;
SELECT TABLE_NAME, TABLE_ROWS 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'parkshare' 
ORDER BY TABLE_NAME;
