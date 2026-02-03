# Login Troubleshooting Guide

## Problem: Login Not Working

Let me help you fix this step by step.

---

## Step 1: Check if Backend is Running

Open your backend terminal and look for:

```
✅ Database connected successfully
Server running on port 5000
```

If you see `❌ Database connection failed`, the issue is with MySQL.

---

## Step 2: Verify MySQL is Running

**On Windows:**

1. Open Services (Win + R, type `services.msc`)
2. Look for "MySQL" or "MySQL80"
3. Make sure it's **Running**
4. If not, right-click → Start

---

## Step 3: Check Demo Users Exist

**Option A - Using MySQL Workbench:**

1. Open MySQL Workbench
2. Connect to localhost
3. Run this query:

```sql
USE parkshare;
SELECT email, full_name, role FROM users WHERE email LIKE '%example.com';
```

**Option B - Using Command Line:**

```bash
mysql -u root -p
# Enter password: ArUn#0)7@0)6
USE parkshare;
SELECT email, full_name, role FROM users WHERE email LIKE '%example.com';
```

You should see:

- driver1@example.com
- driver2@example.com
- owner1@example.com
- owner2@example.com
- admin@parkshare.com

---

## Step 4: If Users Don't Exist - Run Seed Data

```bash
cd backend
mysql -u root -p parkshare < database/seed.sql
# Enter password when prompted
```

Or manually run the seed file in MySQL Workbench.

---

## Step 5: Test Login API Directly

**Create a test file:** `testlogin.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Login Test</title>
  </head>
  <body>
    <h1>Login Test</h1>
    <button onclick="testLogin()">Test Login</button>
    <div id="result"></div>

    <script>
      async function testLogin() {
        const result = document.getElementById("result");
        result.innerHTML = "Testing...";

        try {
          const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "driver1@example.com",
              password: "password123",
            }),
          });

          const data = await response.json();

          if (response.ok) {
            result.innerHTML = `
                        <h2 style="color: green">✅ LOGIN SUCCESS!</h2>
                        <p>User: ${data.data.user.full_name}</p>
                        <p>Role: ${data.data.user.role}</p>
                        <p>Token: ${data.data.token ? "Received" : "Missing"}</p>
                    `;
          } else {
            result.innerHTML = `
                        <h2 style="color: red">❌ LOGIN FAILED</h2>
                        <p>${data.message}</p>
                    `;
          }
        } catch (error) {
          result.innerHTML = `
                    <h2 style="color: red">❌ ERROR</h2>
                    <p>${error.message}</p>
                    <p>Is backend running on port 5000?</p>
                `;
        }
      }
    </script>
  </body>
</html>
```

Save this file and open it in your browser, then click the button.

---

## Step 6: Check Frontend Console

1. Open http://localhost:3000/login
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Try to login
5. Look for errors (usually red text)

**Common Errors:**

### Error: "Network Error" or "Failed to fetch"

- Backend is not running
- Solution: Start backend (`npm run dev`)

### Error: "Invalid credentials"

- Users don't exist in database
- Solution: Run seed data (Step 4)

### Error: "CORS error"

- Backend CORS not configured
- Solution: Check backend has `cors` middleware

---

## Step 7: Quick Fix - Restart Everything

Sometimes the easiest solution:

1. **Stop both servers** (Ctrl+C in both terminals)

2. **Restart Backend:**

```bash
cd backend
npm run dev
```

Wait for: `✅ Database connected successfully`

3. **Restart Frontend:**

```bash
cd frontend
npm start
```

4. **Try login again**

---

## Step 8: Still Not Working?

Run these commands in order:

```bash
# 1. Check if MySQL is accessible
mysql -u root -p
# Enter password: ArUn#0)7@0)6

# 2. Inside MySQL, check database exists
SHOW DATABASES;
# You should see 'parkshare'

# 3. Use the database
USE parkshare;

# 4. Check if users table exists
SHOW TABLES;
# You should see 'users' and other tables

# 5. Check if demo users exist
SELECT email, role FROM users;

# 6. If no users, import seed data
\. ../database/seed.sql
# OR
source ../database/seed.sql

# 7. Exit MySQL
EXIT;
```

---

## What Should Work:

**Demo Credentials:**

- Email: `driver1@example.com`
- Password: `password123`

**OR Click the colored badges on login page:**

- Blue badge = Auto-fill driver credentials
- Pink badge = Auto-fill owner credentials
- Cyan badge = Auto-fill admin credentials

---

## Expected Behavior:

1. Enter credentials
2. Click Login
3. You see a green toast notification: "Welcome back, [Name]!"
4. You are redirected to your dashboard

---

## If All Else Fails:

**Fresh Database Setup:**

```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE IF EXISTS parkshare;
CREATE DATABASE parkshare;
EXIT;

# Run schema
mysql -u root -p parkshare < database/schema.sql

# Run seed data
mysql -u root -p parkshare < database/seed.sql

# Restart backend
cd backend
npm run dev
```

---

## Need More Help?

Check the backend terminal for error messages when you try to login. The error will show exactly what's wrong!
