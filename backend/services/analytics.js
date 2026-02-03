const db = require("../config/database");

/**
 * Get platform overview statistics
 */
async function getPlatformOverview() {
  try {
    const [userStats] = await db.query(`
      SELECT 
        role,
        COUNT(*) as count
      FROM users
      GROUP BY role
    `);

    const [listingStats] = await db.query(`
      SELECT 
        COUNT(*) as total_listings,
        SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_listings,
        SUM(total_slots) as total_slots,
        SUM(available_slots) as available_slots
      FROM parking_listings
    `);

    const [bookingStats] = await db.query(`
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN booking_status = 'active' THEN 1 ELSE 0 END) as active_bookings,
        SUM(CASE WHEN booking_status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(total_amount) as total_revenue
      FROM bookings
    `);

    return {
      users: userStats,
      listings: listingStats[0],
      bookings: bookingStats[0],
    };
  } catch (error) {
    console.error("Error getting platform overview:", error);
    throw error;
  }
}

/**
 * Get peak hours analysis
 */
async function getPeakHours() {
  try {
    const [peakHours] = await db.query(`
      SELECT 
        HOUR(start_time) as hour,
        COUNT(*) as booking_count,
        SUM(total_amount) as revenue
      FROM bookings
      WHERE booking_status IN ('completed', 'active')
      GROUP BY HOUR(start_time)
      ORDER BY booking_count DESC
    `);

    return peakHours;
  } catch (error) {
    console.error("Error getting peak hours:", error);
    throw error;
  }
}

/**
 * Get demand zones (high booking areas)
 */
async function getDemandZones(limit = 10) {
  try {
    const [zones] = await db.query(
      `
      SELECT 
        p.id,
        p.title,
        p.address,
        p.latitude,
        p.longitude,
        p.owner_type,
        COUNT(b.id) as booking_count,
        SUM(b.total_amount) as total_revenue,
        AVG(b.total_amount) as avg_booking_value
      FROM parking_listings p
      LEFT JOIN bookings b ON p.id = b.parking_id
      GROUP BY p.id
      ORDER BY booking_count DESC
      LIMIT ?
    `,
      [limit],
    );

    return zones;
  } catch (error) {
    console.error("Error getting demand zones:", error);
    throw error;
  }
}

/**
 * Get revenue trends (daily, weekly, monthly)
 */
async function getRevenueTrends(period = "daily", days = 30) {
  try {
    let groupBy;
    switch (period) {
      case "daily":
        groupBy = "DATE(created_at)";
        break;
      case "weekly":
        groupBy = "YEARWEEK(created_at)";
        break;
      case "monthly":
        groupBy = 'DATE_FORMAT(created_at, "%Y-%m")';
        break;
      default:
        groupBy = "DATE(created_at)";
    }

    const [trends] = await db.query(
      `
      SELECT 
        ${groupBy} as period,
        COUNT(*) as booking_count,
        SUM(total_amount) as revenue,
        AVG(total_amount) as avg_booking_value
      FROM bookings
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      AND payment_status = 'paid'
      GROUP BY period
      ORDER BY period ASC
    `,
      [days],
    );

    return trends;
  } catch (error) {
    console.error("Error getting revenue trends:", error);
    throw error;
  }
}

/**
 * Get user activity trends
 */
async function getUserActivity(days = 30) {
  try {
    const [activity] = await db.query(
      `
      SELECT 
        DATE(created_at) as date,
        role,
        COUNT(*) as new_users
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at), role
      ORDER BY date ASC
    `,
      [days],
    );

    return activity;
  } catch (error) {
    console.error("Error getting user activity:", error);
    throw error;
  }
}

/**
 * Get revenue by parking type
 */
async function getRevenueByParkingType() {
  try {
    const [revenue] = await db.query(`
      SELECT 
        p.owner_type,
        COUNT(b.id) as booking_count,
        SUM(b.total_amount) as total_revenue,
        AVG(b.total_amount) as avg_booking_value,
        AVG(p.price_per_hour) as avg_price_per_hour
      FROM bookings b
      JOIN parking_listings p ON b.parking_id = p.id
      WHERE b.payment_status = 'paid'
      GROUP BY p.owner_type
    `);

    return revenue;
  } catch (error) {
    console.error("Error getting revenue by parking type:", error);
    throw error;
  }
}

module.exports = {
  getPlatformOverview,
  getPeakHours,
  getDemandZones,
  getRevenueTrends,
  getUserActivity,
  getRevenueByParkingType,
};
