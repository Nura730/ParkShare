const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * DEMO USERS (in-memory)
 * Resets when server restarts
 */
const demoUsers = [];

/**
 * REGISTER (DEMO MODE)
 */
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone, role } = req.body;

    if (!email || !password || !full_name || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existing = demoUsers.find((u) => u.email === email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists (demo)",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = {
      id: demoUsers.length + 1,
      email,
      password_hash,
      full_name,
      phone,
      role,
      verification_status: "demo",
    };

    demoUsers.push(user);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "demo_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Demo registration successful",
      data: {
        user: {
          id: user.id,
          email,
          full_name,
          phone,
          role,
          verification_status: "demo",
        },
        token,
      },
    });
  } catch (err) {
    console.error("Demo register error:", err);
    res.status(500).json({ success: false, message: "Demo register failed" });
  }
};

/**
 * LOGIN (DEMO MODE)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = demoUsers.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (demo)",
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (demo)",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "demo_secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Demo login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
          verification_status: "demo",
        },
        token,
      },
    });
  } catch (err) {
    console.error("Demo login error:", err);
    res.status(500).json({ success: false, message: "Demo login failed" });
  }
};
