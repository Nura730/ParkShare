const { calculateDistance } = require("../utils/distance");

/**
 * Calculate parking score based on distance, price, and availability
 * This is the rule-based recommendation algorithm
 */
function calculateParkingScore(parking, userLat, userLng, preferences = {}) {
  // Calculate distance using Haversine formula
  const distance = calculateDistance(
    userLat,
    userLng,
    parking.latitude,
    parking.longitude,
  );

  // Normalize scores to 0-100 scale
  // Distance: Closer is better (inversely proportional)
  const distanceScore = Math.max(0, 100 - distance * 10);

  // Price: Cheaper is better (inversely proportional)
  const priceScore = Math.max(0, 100 - parking.price_per_hour * 0.5);

  // Availability: More available slots is better
  const availabilityScore =
    parking.available_slots > 0
      ? (parking.available_slots / parking.total_slots) * 100
      : 0;

  // Weighted scoring (can be customized based on user preferences)
  const weights = preferences.weights || {
    distance: 0.5, // 50% weight - most important
    price: 0.3, // 30% weight
    availability: 0.2, // 20% weight
  };

  // Calculate total score
  const totalScore =
    distanceScore * weights.distance +
    priceScore * weights.price +
    availabilityScore * weights.availability;

  return {
    parking,
    score: Math.round(totalScore * 100) / 100, // Round to 2 decimal places
    distance: Math.round(distance * 100) / 100,
    breakdown: {
      distanceScore: Math.round(distanceScore * 100) / 100,
      priceScore: Math.round(priceScore * 100) / 100,
      availabilityScore: Math.round(availabilityScore * 100) / 100,
    },
  };
}

/**
 * Detect overstay and calculate extra charges
 */
function detectOverstay(booking) {
  const bookedEndTime = new Date(booking.end_time);
  const actualEndTime = booking.actual_end_time
    ? new Date(booking.actual_end_time)
    : new Date();

  if (actualEndTime > bookedEndTime) {
    // Calculate overstay time in minutes
    const overstayMinutes = (actualEndTime - bookedEndTime) / (1000 * 60);
    const overstayHours = Math.ceil(overstayMinutes / 60); // Round up to nearest hour

    // Calculate extra charges (1.5x normal rate)
    const normalRate = booking.base_amount / booking.booked_hours;
    const overstayRate = normalRate * 1.5;
    const overstayAmount = overstayHours * overstayRate;

    return {
      hasOverstay: true,
      overstayHours,
      overstayAmount: Math.round(overstayAmount * 100) / 100,
      totalAmount:
        Math.round((booking.base_amount + overstayAmount) * 100) / 100,
      normalRate,
      overstayRate,
    };
  }

  return {
    hasOverstay: false,
    overstayHours: 0,
    overstayAmount: 0,
    totalAmount: booking.base_amount,
  };
}

/**
 * Check if parking is currently available based on time
 */
function isWithinAvailableHours(parking, checkTime = new Date()) {
  const currentHour = checkTime.getHours();
  const currentMinute = checkTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Parse available hours
  const [startHour, startMinute] = parking.available_hours_start
    .split(":")
    .map(Number);
  const [endHour, endMinute] = parking.available_hours_end
    .split(":")
    .map(Number);

  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;

  return (
    currentTimeInMinutes >= startTimeInMinutes &&
    currentTimeInMinutes <= endTimeInMinutes
  );
}

/**
 * Filter and sort parkings based on search criteria
 */
function filterAndSortParkings(parkings, userLat, userLng, filters = {}) {
  let filtered = parkings.filter((parking) => {
    // Filter by distance radius
    if (filters.radius) {
      const distance = calculateDistance(
        userLat,
        userLng,
        parking.latitude,
        parking.longitude,
      );
      if (distance > filters.radius) return false;
    }

    // Filter by max price
    if (filters.maxPrice && parking.price_per_hour > filters.maxPrice) {
      return false;
    }

    // Filter by minimum slots
    if (filters.minSlots && parking.available_slots < filters.minSlots) {
      return false;
    }

    // Filter by owner type
    if (filters.ownerType && parking.owner_type !== filters.ownerType) {
      return false;
    }

    // Only show active listings
    if (!parking.is_active) {
      return false;
    }

    return true;
  });

  // Calculate scores for all filtered parkings
  const scoredParkings = filtered.map((parking) =>
    calculateParkingScore(parking, userLat, userLng, filters),
  );

  // Sort by score (highest first)
  scoredParkings.sort((a, b) => b.score - a.score);

  return scoredParkings;
}

module.exports = {
  calculateParkingScore,
  detectOverstay,
  isWithinAvailableHours,
  filterAndSortParkings,
};
