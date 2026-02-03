# 🚗 Smart Parking Share Platform

### IBM Skills Development Demo Project

A full-stack web application solving urban parking inefficiency by connecting drivers with unused parking spaces.

---

## 📌 Project Overview

**Problem**: Drivers waste time and fuel searching for affordable parking, while many house owners and parking area owners have unused spaces.

**Solution**: Location-based parking sharing platform with hour-based booking, smart recommendation algorithms, and automated misuse detection.

---

## ✅ What's Been Built

### Backend (Node.js + Express + MySQL) - ✅ COMPLETE

#### Core Features

- ✅ JWT-based authentication system
- ✅ Role-based access control (Driver, Owner, Admin)
- ✅ RESTful API architecture with 20+ endpoints
- ✅ MySQL database with 5 normalized tables
- ✅ Rule-based smart logic algorithms

#### Smart Logic (Explainable for Viva)

1. **Parking Recommendation Algorithm**
   - Scores parking based on: Distance (50%), Price (30%), Availability (20%)
   - Uses Haversine formula for GPS distance calculation
   - Completely transparent and explainable

2. **Overstay Detection**
   - Automatically detects when driver exceeds booked time
   - Calculates extra charges (1.5x normal rate)
   - Triggers misuse report after 3+ overstays

3. **Misuse Detection**
   - Auto-flags repeated overstays
   - Detects inactive listings (no bookings in 60 days)
   - Identifies suspicious listing patterns

#### API Modules

- `/api/auth` - Authentication (register, login, profile)
- `/api/parking` - Parking search and details
- `/api/bookings` - Booking management
- `/api/payments` - Payment simulation
- `/api/owner` - Listing and earnings management
- `/api/admin` - User management, analytics, misuse reports

### Database Schema - ✅ COMPLETE

**Tables**:

1. `users` - User accounts with roles
2. `parking_listings` - Parking spaces with location, pricing
3. `bookings` - Booking records with overstay tracking
4. `payments` - Dummy payment records
5. `misuse_reports` - Auto-detected and manual flags

**Seed Data**: 8 users, 8 parking listings, 10 bookings, 8 payments

### Frontend (React) - 🔧 IN PROGRESS

#### Completed

- ✅ Project structure setup
- ✅ Axios API service with interceptors
- ✅ Authentication context (React Context API)
- ✅ Protected route component
- ✅ Navbar with role-based menus
- ✅ Home page with problem/solution presentation

#### To Be Completed (Structure Created)

- Authentication pages (Login/Register)
- Search parking page with map/list view
- Driver dashboard and booking flow
- Owner dashboard and listing management
- Admin dashboard with analytics
- Responsive CSS styling

---

## 🛠 Technology Stack

| Layer              | Technology            | Justification                                               |
| ------------------ | --------------------- | ----------------------------------------------------------- |
| **Frontend**       | React                 | Component-based, virtual DOM, rich ecosystem                |
| **Backend**        | Node.js + Express     | JavaScript full-stack, non-blocking I/O, fast development   |
| **Database**       | MySQL                 | ACID compliance, complex queries, structured data           |
| **Authentication** | JWT                   | Stateless, scalable, industry standard                      |
| **Smart Logic**    | Rule-based algorithms | Explainable, deterministic, suitable for viva demonstration |

---

## 📂 Project Structure

````
ParkShare/
├── backend/                    # Node.js API Server
│   ├── config/
│   │   └── database.js        # MySQL connection
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── roleCheck.js       # Role-based access
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── parkingController.js
│   │   ├── bookingController.js
│   │   ├── paymentController.js
│   │   ├── ownerController.js
│   │   └── adminController.js
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   │   ├── smartLogic.js     # Parking scoring, overstay detection
│   │   ├── misuseDetection.js # Misuse flagging algorithms
│   │   └── analytics.js       # Admin analytics
│   ├── utils/
│   │   ├── distance.js        # Haversine formula
│   │   └── mockData.js        # Sample parking data
│   ├── server.js
│   ├── .env                   # Environment configuration
│   └── package.json
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── driver/       # Driver pages
│   │   │   ├── owner/        # Owner pages
│   │   │   └── admin/        # Admin pages
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── parkingService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── App.jsx
│   └── package.json
│
├── database/                   # SQL Files
│   ├── schema.sql             # Table definitions
│   ├── seed.sql               # Demo data
│   └── README.md              # Setup instructions
│
└── docs/                       # Documentation

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+
- MySQL 8.0+
- npm

### 1. Database Setup

```bash
# Open MySQL
mysql -u root -p

# Run schema
mysql -u root -p < database/schema.sql

# Insert seed data
mysql -u root -p < database/seed.sql
````

### 2. Backend Setup

```bash
cd backend

# Install dependencies (already done)
npm install

# Configure environment
# Edit .env file with your MySQL credentials
# DB_PASSWORD=your_mysql_password

# Start server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🔐 Demo Credentials

### Admin

- Email: `admin@parkshare.com`
- Password: `password123`

### Driver

- Email: `driver1@example.com`
- Password: `password123`

### Owner

- Email: `owner1@example.com`
- Password: `password123`

---

## 🎯 Key Features for Viva

### 1. Smart Parking Recommendation

**Algorithm**:

```javascript
Score = (Distance_Score × 0.5) + (Price_Score × 0.3) + (Availability_Score × 0.2)
```

- **Explainable**: Each parking gets a transparent breakdown
- **No ML**: Rule-based for demo clarity
- **Future-ready**: Can be replaced with ML

### 2. Overstay Detection

- Compares actual end time with booked end time
- Automatic extra charge calculation (1.5x rate)
- Triggers misuse reporting system

### 3. Role-Based System

- **Driver**: Search, book, pay
- **Owner**: List parking, manage bookings, view earnings
- **Admin**: Monitor users, listings, analytics

### 4. Payment Simulation

- Clear demo disclaimer
- Dummy transaction IDs
- 90% success rate simulation
- No real money processed

---

## 📊 API Endpoints Summary

```
Auth:
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile

Parking:
GET    /api/parking/search?lat=12.97&lng=77.59&radius=5
GET    /api/parking/nearby?lat=12.97&lng=77.59
GET    /api/parking/:id

Bookings:
POST   /api/bookings
GET    /api/bookings/driver
PUT    /api/bookings/:id/complete

Payments:
POST   /api/payments/simulate

Owner:
POST   /api/owner/listings
GET    /api/owner/listings
GET    /api/owner/earnings

Admin:
GET    /api/admin/users
GET    /api/admin/analytics
GET    /api/admin/misuse
```

---

## 🔬 Rule-Based Logic Explanation (For Viva)

### Why Rule-Based Instead of ML?

1. **Explainability**: Every decision can be traced
2. **Demo-Appropriate**: Easy to demonstrate and explain
3. **Resource-Efficient**: No training data or GPUs needed
4. **Deterministic**: Same input = Same output
5. **Viva-Friendly**: Can explain logic line by line

### Algorithms

**1. Parking Scoring**: Haversine distance + weighted scoring
**2. Overstay Detection**: Time comparison + rate calculation
**3. Misuse Flagging**: Pattern matching + threshold rules

---

## 🚫 Limitations (By Design)

- ✅ No real payments (dummy simulation)
- ✅ No real government verification
- ✅ No machine learning
- ✅ Local deployment only
- ✅ Mock GPS coordinates

---

## 🔮 Future Scope

### Phase 1: Enhanced Features

- Real Geolocation API
- Real payment integration (Razorpay/Stripe)
- Email/SMS notifications

### Phase 2: IoT Integration

- IoT sensors for vehicle detection
- Automated gates
- License plate recognition

### Phase 3: Cloud & AI

- IBM Cloud deployment
- IBM Watson chatbot
- ML-based dynamic pricing
- Demand forecasting

### Phase 4: Mobile

- React Native apps
- Offline mode
- Push notifications

---

## 🎓 Viva Preparation

### Problem Statement

"Urban drivers waste time and fuel searching for parking, while space owners have unused capacity. Our platform connects them through location-based booking with transparent rule-based algorithms."

### Technical Highlights

- Full-stack MERN-like architecture (React + Node + MySQL)
- RESTful API design
- JWT authentication
- Rule-based smart logic (explain Haversine formula)
- Database normalization (3NF)
- Role-based access control

### Demo Flow

1. Show home page → explain problem
2. Register as driver → show JWT token storage
3. Search parking → explain scoring algorithm
4. Book and pay → show overstay logic
5. Switch to owner → show listings and earnings
6. Switch to admin → show analytics
7. Explain code snippets from smart logic service

---

## 📝 What You Have So Far

### ✅ Fully Functional Backend

- All APIs working
- Smart logic implemented
- Database with seed data
- Authentication system

### ✅ Frontend Foundation

- React app setup
- Authentication context
- API services
- Basic components

### 🔧 Next Steps for Full Demo

1. Complete frontend pages (Login, Register, Search, Dashboards)
2. Add CSS styling for professional look
3. Test complete user flows
4. Optional: Deploy locally for demo

---

## 📞 Support

This is a demo project for IBM Skills Development selection. All features are designed for demonstration and educational purposes.

**Note**: Payment is simulated. No real money is processed.

---

## 📄 License

MIT License - Demo Project for Educational Purposes

---

**Built with** ❤️ **for IBM Skills Development Program**

```

Key Achievements:
- ✅ Complete backend with smart logic
- ✅ Database with realistic seed data
- ✅ Frontend structure with authentication
- ✅ Viva-ready explanation of algorithms
- ✅ Professional documentation

**Status**: Backend complete, Frontend 40% complete (structure + key components ready)
```
#   P a r k S h a r e  
 