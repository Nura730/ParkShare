# Database Setup Instructions

## Prerequisites

- MySQL 8.0 or higher installed
- MySQL server running on localhost
- Command line access to MySQL

## Setup Steps

### 1. Create Database and Schema

Open MySQL command line or workbench and run:

```bash
mysql -u root -p < schema.sql
```

Or manually:

1. Open MySQL command line
2. Run: `source /path/to/schema.sql`

This will:

- Create `parkshare` database
- Create all 5 tables (users, parking_listings, bookings, payments, misuse_reports)
- Set up indexes and foreign key relationships

### 2. Insert Seed Data

```bash
mysql -u root -p < seed.sql
```

Or manually:

1. Open MySQL command line
2. Run: `source /path/to/seed.sql`

This will insert:

- 8 demo users (1 admin, 3 drivers, 4 owners)
- 8 parking listings across Bangalore
- 10 sample bookings (completed, active, pending)
- 8 payment records
- 3 misuse reports

### 3. Verify Setup

```sql
USE parkshare;
SHOW TABLES;

-- Check data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM parking_listings;
SELECT COUNT(*) FROM bookings;
```

## Demo Credentials

### Admin

- Email: `admin@parkshare.com`
- Password: `password123`

### Driver

- Email: `driver1@example.com`
- Password: `password123`

### Owner

- Email: `owner1@example.com`
- Password: `password123`

## Database Configuration

Update the `.env` file in the backend directory with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=parkshare
```

## Table Structure

1. **users** - Stores user accounts (drivers, owners, admins)
2. **parking_listings** - Parking spaces listed by owners
3. **bookings** - Booking records with overstay tracking
4. **payments** - Payment simulation records
5. **misuse_reports** - Auto-detected and manual misuse flags

## Important Notes

⚠️ **Demo Mode**: All passwords are hashed with bcrypt. Default password is "password123"

⚠️ **Mock Data**: Parking locations are real Bangalore coordinates but listings are fictional

⚠️ **Reset Database**: To reset, run `schema.sql` again (it drops existing tables)

## Troubleshooting

**Error: Access denied**

- Check MySQL credentials in `.env` file
- Ensure MySQL server is running

**Error: Database already exists**

- The schema.sql drops and recreates tables automatically
- Safe to run multiple times

**Error: Foreign key constraint fails**

- Run schema.sql before seed.sql
- Ensure tables are created in correct order
