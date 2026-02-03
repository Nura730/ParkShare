const db = require("../config/database");
const { filterAndSortParkings } = require("../services/smartLogic");

/**
 * Search parking listings
 */
exports.searchParking = async (req, res) => {
  try {
    const { lat, lng, radius, maxPrice, minSlots, ownerType } = req.query;

    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    // Get all active parking listings
    const [parkings] = await db.query(
      "SELECT * FROM parking_listings WHERE is_active = true",
    );

    // Apply filters and sort using smart logic
    const filters = {
      radius: radius ? parseFloat(radius) : 10, // Default 10km radius
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      minSlots: minSlots ? parseInt(minSlots) : null,
      ownerType: ownerType || null,
    };

    const scoredParkings = filterAndSortParkings(
      parkings,
      userLat,
      userLng,
      filters,
    );

    res.json({
      success: true,
      count: scoredParkings.length,
      data: scoredParkings,
    });
  } catch (error) {
    console.error("Search parking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get nearby parking with detailed scoring
 */
exports.getNearbyParking = async (req, res) => {
  try {
    const { lat, lng, limit = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    // Get all active parking listings
    const [parkings] = await db.query(
      "SELECT * FROM parking_listings WHERE is_active = true",
    );

    // Get scored and sorted parkings
    const scoredParkings = filterAndSortParkings(parkings, userLat, userLng);

    // Limit results
    const limitedResults = scoredParkings.slice(0, parseInt(limit));

    res.json({
      success: true,
      count: limitedResults.length,
      data: limitedResults,
    });
  } catch (error) {
    console.error("Get nearby parking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get parking details by ID
 */
exports.getParkingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [parkings] = await db.query(
      `SELECT p.*, u.email as owner_email, u.full_name as owner_name, u.phone as owner_phone
       FROM parking_listings p
       JOIN users u ON p.owner_id = u.id
       WHERE p.id = ?`,
      [id],
    );

    if (parkings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parking not found",
      });
    }

    res.json({
      success: true,
      data: parkings[0],
    });
  } catch (error) {
    console.error("Get parking details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get navigation link for parking
 */
exports.getNavigationLink = async (req, res) => {
  try {
    const { id } = req.params;

    const [parkings] = await db.query(
      "SELECT latitude, longitude, title, address FROM parking_listings WHERE id = ?",
      [id],
    );

    if (parkings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parking not found",
      });
    }

    const parking = parkings[0];
    const navigationLink = `https://www.google.com/maps/dir/?api=1&destination=${parking.latitude},${parking.longitude}`;

    res.json({
      success: true,
      data: {
        navigationLink,
        parking: {
          title: parking.title,
          address: parking.address,
          coordinates: {
            latitude: parking.latitude,
            longitude: parking.longitude,
          },
        },
      },
    });
  } catch (error) {
    console.error("Get navigation link error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
