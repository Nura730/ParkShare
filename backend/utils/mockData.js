/**
 * Mock parking data for Bangalore locations
 * This can be used to seed the database or for testing
 */
const MOCK_PARKING_LOCATIONS = [
  {
    title: "Indiranagar House Parking",
    description:
      "Secure parking space near 100ft road. Perfect for daily commuters.",
    address: "100 Feet Road, Indiranagar, Bangalore - 560038",
    latitude: 12.9716,
    longitude: 77.6412,
    price_per_hour: 30,
    total_slots: 2,
    owner_type: "house",
  },
  {
    title: "Koramangala Commercial Parking",
    description: "Multi-level parking facility with 24/7 security and CCTV.",
    address: "80 Feet Road, Koramangala 4th Block, Bangalore - 560034",
    latitude: 12.9352,
    longitude: 77.6245,
    price_per_hour: 50,
    total_slots: 20,
    owner_type: "commercial",
  },
  {
    title: "MG Road Parking Area",
    description: "Premium parking near metro station and shopping district.",
    address: "MG Road, Bangalore - 560001",
    latitude: 12.9759,
    longitude: 77.6061,
    price_per_hour: 80,
    total_slots: 15,
    owner_type: "parking_area",
  },
  {
    title: "Whitefield Tech Park Parking",
    description:
      "Large parking area near IT offices. Covered parking available.",
    address: "ITPL Main Road, Whitefield, Bangalore - 560066",
    latitude: 12.9698,
    longitude: 77.75,
    price_per_hour: 40,
    total_slots: 30,
    owner_type: "parking_area",
  },
  {
    title: "HSR Layout Residential Parking",
    description: "Safe house parking space. Well-lit area with gate security.",
    address: "Sector 2, HSR Layout, Bangalore - 560102",
    latitude: 12.9116,
    longitude: 77.6473,
    price_per_hour: 25,
    total_slots: 1,
    owner_type: "house",
  },
  {
    title: "Jayanagar Shopping Complex Parking",
    description:
      "Parking for shoppers and visitors. Ground floor covered parking.",
    address: "4th Block, Jayanagar, Bangalore - 560011",
    latitude: 12.925,
    longitude: 77.5838,
    price_per_hour: 45,
    total_slots: 10,
    owner_type: "commercial",
  },
  {
    title: "Malleswaram House Parking",
    description: "Small but convenient parking spot near market area.",
    address: "8th Cross, Malleswaram, Bangalore - 560003",
    latitude: 13.0059,
    longitude: 77.5706,
    price_per_hour: 20,
    total_slots: 1,
    owner_type: "house",
  },
  {
    title: "Electronic City Parking Zone",
    description:
      "Large parking facility for tech professionals. Open 24 hours.",
    address: "Electronics City Phase 1, Bangalore - 560100",
    latitude: 12.8456,
    longitude: 77.6603,
    price_per_hour: 35,
    total_slots: 25,
    owner_type: "parking_area",
  },
];

/**
 * Mock user location (Bangalore City Center)
 */
const MOCK_USER_LOCATION = {
  latitude: 12.9716,
  longitude: 77.5946,
  accuracy: 100,
  isMock: true,
};

module.exports = {
  MOCK_PARKING_LOCATIONS,
  MOCK_USER_LOCATION,
};
