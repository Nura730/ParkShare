const mysql = require("mysql2/promise");

async function checkLogin() {
  console.log("🔍 Checking Login System...\n");

  let connection;

  try {
    // Test 1: Connect to database
    console.log("1. Testing database connection...");
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "ArUn#0)7@0)6",
      database: "parkshare",
    });
    console.log("✅ Database connected!\n");

    // Test 2: Check if users table exists
    console.log("2. Checking if users table exists...");
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    if (tables.length === 0) {
      console.log("❌ Users table does NOT exist!");
      console.log("→ Run: mysql -u root -p parkshare < database/schema.sql\n");
      return;
    }
    console.log("✅ Users table exists!\n");

    // Test 3: Check if demo users exist
    console.log("3. Checking for demo users...");
    const [users] = await connection.query(
      "SELECT email, full_name, role FROM users WHERE email IN (?, ?, ?)",
      ["driver1@example.com", "owner1@example.com", "admin@parkshare.com"],
    );

    if (users.length === 0) {
      console.log("❌ No demo users found!");
      console.log("→ Run: mysql -u root -p parkshare < database/seed.sql\n");
      return;
    }

    console.log("✅ Found demo users:");
    users.forEach((user) => {
      console.log(`   - ${user.email} (${user.role}) - ${user.full_name}`);
    });
    console.log("");

    // Test 4: Test password hash validation
    console.log("4. Testing password validation...");
    const [demoUser] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      ["driver1@example.com"],
    );

    if (demoUser.length === 0) {
      console.log("❌ Driver demo user not found!\n");
      return;
    }

    const bcrypt = require("bcryptjs");
    const isValidPassword = await bcrypt.compare(
      "password123",
      demoUser[0].password_hash,
    );

    if (isValidPassword) {
      console.log("✅ Password hash is valid!\n");
    } else {
      console.log("❌ Password hash is INVALID!");
      console.log(
        "→ Re-run seed data: mysql -u root -p parkshare < database/seed.sql\n",
      );
      return;
    }

    // Test 5: Check backend API
    console.log("5. Testing login API endpoint...");
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "driver1@example.com",
          password: "password123",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log("❌ API returned error:", error.message);
        console.log("→ Check backend terminal for errors\n");
        return;
      }

      const data = await response.json();
      console.log("✅ Login API works!");
      console.log(`   User: ${data.data.user.full_name}`);
      console.log(`   Role: ${data.data.user.role}`);
      console.log(`   Token: ${data.data.token ? "Received" : "Missing"}\n`);
    } catch (apiError) {
      console.log("❌ Cannot connect to backend API");
      console.log("→ Is backend running? (npm run dev in backend folder)\n");
      return;
    }

    console.log("═══════════════════════════════════════");
    console.log("✅ ALL CHECKS PASSED!");
    console.log("═══════════════════════════════════════");
    console.log("Login should work. Try these credentials:");
    console.log("Email: driver1@example.com");
    console.log("Password: password123");
    console.log("");
    console.log("If it still doesn't work:");
    console.log("1. Open browser console (F12)");
    console.log("2. Try to login");
    console.log("3. Check for any error messages");
  } catch (error) {
    console.log("\n❌ ERROR:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.log("→ MySQL is not running. Start MySQL service.");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("→ Wrong MySQL password. Check backend/.env file.");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.log('→ Database "parkshare" does not exist.');
      console.log('→ Run: mysql -u root -p -e "CREATE DATABASE parkshare"');
      console.log("→ Then: mysql -u root -p parkshare < database/schema.sql");
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkLogin();
