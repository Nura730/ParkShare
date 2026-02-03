const db = require("../config/database");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone, role, verification_doc_url } =
      req.body;

    // Validate required fields
    if (!email || !password || !full_name || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate role
    const validRoles = ["driver", "owner", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be driver, owner, or admin",
      });
    }

    // Check if user already exists
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await db.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role, verification_doc_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        email,
        password_hash,
        full_name,
        phone,
        role,
        verification_doc_url || null,
      ],
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" },
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: result.insertId,
          email,
          full_name,
          phone,
          role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if user exists
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" },
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
          verification_status: user.verification_status,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/**
 * Get current user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, email, full_name, phone, role, verification_status, created_at FROM users WHERE id = ?",
      [req.user.id],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone } = req.body;
    const updates = {};

    if (full_name) updates.full_name = full_name;
    if (phone) updates.phone = phone;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), req.user.id];

    await db.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
