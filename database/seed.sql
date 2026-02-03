-- ============================================
-- ParkShare Platform - Seed Data
-- ============================================

USE parkshare;

-- ============================================
-- Seed Users
-- Password for all demo users: "password123"
-- Hash generated with bcryptjs (10 rounds)
-- ============================================

-- Admin user
INSERT INTO users (email, password_hash, full_name, phone, role, verification_status) VALUES
('admin@parkshare.com', '$2a$10$rR5YvJj5yTvN5Mz5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5O', 'Admin User', '9999999999', 'admin', 'verified');

-- Demo drivers
INSERT INTO users (email, password_hash, full_name, phone, role, verification_status) VALUES
('driver1@example.com', '$2a$10$rR5YvJj5yTvN5Mz5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5O', 'Raj Kumar', '9876543210', 'driver', 'verified'),
('driver2@example.com', '$2a$10$rR5YvJj5yTvN5Mz5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5O', 'Priya Sharma', '9876543211', 'driver', 'verified'),
('driver3@example.com', '$2a$10$rR5YvJj5yTvN5Mz5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5O', 'Amit Patel', '9876543212', 'driver', 'verified');

-- Demo parking owners
INSERT INTO users (email, password_hash, full_name, phone, role, verification_status, verification_doc_url) VALUES
('owner1@example.com', '$2a$10$rR5YvJj5yTvN5Mz5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5O', 'Sanjay Reddy', '9876543220', 'owner', 'verified', 'mock_doc_1.pdf'),
('owner2@example.com', '$2a$10$rR5YvJj5yTvN5Mz5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5O', 'Lakshmi Iyer', '9876543221', 'owner', 'verified', 'mock_doc_2.pdf'),
('owner3@example.com', '$2a$10$rR5YvJj5yTvN5Mz5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5O', 'Mohammed Ali', '9876543222', 'owner', 'verified', 'mock_doc_3.pdf'),
('owner4@example.com', '$2a$10$rR5YvJj5yTvN5Mz5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5O', 'Deepak Singh', '9876543223', 'owner', 'pending', 'mock_doc_4.pdf');

-- ============================================
-- Seed Parking Listings (Bangalore locations)
-- ============================================

INSERT INTO parking_listings 
(owner_id, title, description, address, latitude, longitude, price_per_hour, total_slots, available_slots, owner_type, booking_mode) 
VALUES
-- Owner 1 listings
(5, 'Indiranagar House Parking', 'Secure parking space near 100ft road. Perfect for daily commuters. Well-lit area with gate security.', 
 '100 Feet Road, Indiranagar, Bangalore - 560038', 12.9716, 77.6412, 30, 2, 2, 'house', 'automatic'),

-- Owner 2 listings
(6, 'Koramangala Commercial Parking', 'Multi-level parking facility with 24/7 security and CCTV surveillance. Covered parking available.',
 '80 Feet Road, Koramangala 4th Block, Bangalore - 560034', 12.9352, 77.6245, 50, 20, 18, 'commercial', 'automatic'),

-- Owner 3 listings
(7, 'MG Road Parking Area', 'Premium parking near metro station and shopping district. Easy access to main road.',
 'MG Road, Bangalore - 560001', 12.9759, 77.6061, 80, 15, 12, 'parking_area', 'manual'),

(7, 'Whitefield Tech Park Parking', 'Large parking area near IT offices. Covered parking available with wash facility.',
 'ITPL Main Road, Whitefield, Bangalore - 560066', 12.9698, 77.7500, 40, 30, 28, 'parking_area', 'automatic'),

-- Owner 4 listings (pending verification)
(8, 'HSR Layout Residential Parking', 'Safe house parking space. Well-lit area with CCTV cameras.',
 'Sector 2, HSR Layout, Bangalore - 560102', 12.9116, 77.6473, 25, 1, 1, 'house', 'automatic'),

-- Owner 5 additional listings
(5, 'Jayanagar Shopping Complex Parking', 'Parking for shoppers and visitors. Ground floor covered parking with easy access.',
 '4th Block, Jayanagar, Bangalore - 560011', 12.9250, 77.5838, 45, 10, 9, 'commercial', 'automatic'),

(6, 'Malleswaram House Parking', 'Small but convenient parking spot near market area. Safe neighborhood.',
 '8th Cross, Malleswaram, Bangalore - 560003', 13.0059, 77.5706, 20, 1, 1, 'house', 'manual'),

(7, 'Electronic City Parking Zone', 'Large parking facility for tech professionals. Open 24 hours with security.',
 'Electronics City Phase 1, Bangalore - 560100', 12.8456, 77.6603, 35, 25, 23, 'parking_area', 'automatic');

-- ============================================
-- Seed Bookings (Sample booking history)
-- ============================================

-- Completed bookings
INSERT INTO bookings 
(parking_id, driver_id, booking_status, start_time, end_time, actual_end_time, booked_hours, base_amount, overstay_hours, overstay_amount, total_amount, payment_status)
VALUES
(1, 2, 'completed', '2026-02-01 09:00:00', '2026-02-01 17:00:00', '2026-02-01 17:00:00', 8, 240, 0, 0, 240, 'paid'),
(2, 3, 'completed', '2026-02-01 10:00:00', '2026-02-01 14:00:00', '2026-02-01 14:30:00', 4, 200, 1, 75, 275, 'paid'),
(4, 2, 'completed', '2026-02-02 08:00:00', '2026-02-02 18:00:00', '2026-02-02 18:00:00', 10, 400, 0, 0, 400, 'paid'),
(6, 4, 'completed', '2026-02-02 11:00:00', '2026-02-02 15:00:00', '2026-02-02 16:00:00', 4, 180, 1, 67.5, 247.5, 'paid');

-- Active bookings
INSERT INTO bookings 
(parking_id, driver_id, booking_status, start_time, end_time, booked_hours, base_amount, total_amount, payment_status)
VALUES
(1, 3, 'active', '2026-02-03 09:00:00', '2026-02-03 17:00:00', 8, 240, 240, 'paid'),
(2, 2, 'active', '2026-02-03 10:00:00', '2026-02-03 16:00:00', 6, 300, 300, 'paid');

-- Confirmed (upcoming) bookings
INSERT INTO bookings 
(parking_id, driver_id, booking_status, start_time, end_time, booked_hours, base_amount, total_amount, payment_status)
VALUES
(4, 4, 'confirmed', '2026-02-04 09:00:00', '2026-02-04 18:00:00', 9, 360, 360, 'paid'),
(8, 3, 'confirmed', '2026-02-04 10:00:00', '2026-02-04 14:00:00', 4, 140, 140, 'paid');

-- Pending approval (manual booking mode)
INSERT INTO bookings 
(parking_id, driver_id, booking_status, start_time, end_time, booked_hours, base_amount, total_amount, payment_status)
VALUES
(3, 2, 'pending', '2026-02-05 10:00:00', '2026-02-05 16:00:00', 6, 480, 480, 'pending'),
(7, 4, 'pending', '2026-02-05 09:00:00', '2026-02-05 12:00:00', 3, 60, 60, 'pending');

-- ============================================
-- Seed Payments
-- ============================================

INSERT INTO payments 
(booking_id, amount, payment_method, transaction_id, payment_status, is_dummy)
VALUES
(1, 240, 'dummy_card', 'DUMMY_1738579200_ABC123XYZ', 'success', TRUE),
(2, 275, 'dummy_upi', 'DUMMY_1738579300_DEF456UVW', 'success', TRUE),
(3, 400, 'dummy_card', 'DUMMY_1738665600_GHI789RST', 'success', TRUE),
(4, 247.5, 'dummy_card', 'DUMMY_1738666800_JKL012MNO', 'success', TRUE),
(5, 240, 'dummy_upi', 'DUMMY_1738752000_PQR345STU', 'success', TRUE),
(6, 300, 'dummy_card', 'DUMMY_1738755600_VWX678YZA', 'success', TRUE),
(7, 360, 'dummy_card', 'DUMMY_1738838400_BCD901EFG', 'success', TRUE),
(8, 140, 'dummy_upi', 'DUMMY_1738842000_HIJ234KLM', 'success', TRUE);

-- ============================================
-- Seed Misuse Reports (Demo data)
-- ============================================

-- Auto-detected overstay
INSERT INTO misuse_reports 
(user_id, report_type, severity, description, auto_detected, admin_reviewed)
VALUES
(3, 'overstay', 'low', 'Driver has 1 overstay in last 30 days', TRUE, FALSE),
(4, 'overstay', 'low', 'Driver has 1 overstay in last 30 days', TRUE, FALSE);

-- Auto-detected inactive listing (if any owner has no bookings)
INSERT INTO misuse_reports 
(user_id, report_type, severity, description, auto_detected, admin_reviewed)
VALUES
(8, 'inactive_listing', 'low', 'Listing "HSR Layout Residential Parking" has no bookings in 60 days', TRUE, TRUE);

-- ============================================
-- Update available slots based on active bookings
-- ============================================

UPDATE parking_listings SET available_slots = available_slots - 1 WHERE id = 1; -- 1 active booking
UPDATE parking_listings SET available_slots = available_slots - 1 WHERE id = 2; -- 1 active booking
UPDATE parking_listings SET available_slots = available_slots - 1 WHERE id = 4; -- 1 confirmed booking
UPDATE parking_listings SET available_slots = available_slots - 1 WHERE id = 8; -- 1 confirmed booking

-- ============================================
-- Success Message & Data Summary
-- ============================================

SELECT 'Seed data inserted successfully!' AS message;

SELECT 'Database Summary:' AS info;
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE role = 'driver') as drivers,
  (SELECT COUNT(*) FROM users WHERE role = 'owner') as owners,
  (SELECT COUNT(*) FROM users WHERE role = 'admin') as admins,
  (SELECT COUNT(*) FROM parking_listings) as total_listings,
  (SELECT COUNT(*) FROM parking_listings WHERE is_active = TRUE) as active_listings,
  (SELECT COUNT(*) FROM bookings) as total_bookings,
  (SELECT COUNT(*) FROM bookings WHERE booking_status = 'active') as active_bookings,
  (SELECT COUNT(*) FROM payments) as total_payments,
  (SELECT COUNT(*) FROM misuse_reports) as misuse_reports;

SELECT '
==============================================
DEMO CREDENTIALS:
==============================================
Admin:
  Email: admin@parkshare.com
  Password: password123

Driver:
  Email: driver1@example.com
  Password: password123

Owner:
  Email: owner1@example.com
  Password: password123
==============================================
' AS demo_credentials;
