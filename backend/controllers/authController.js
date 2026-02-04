const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/** * 🧪 DEMO MODE STORAGE (in-memory) * Data resets when server restarts */ const demoUsers =
  [];
/** * Register a new user (DEMO) */ exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone, role } = req.body;
    if (!email || !password || !full_name || !phone || !role) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide all required fields",
        });
    }
    const validRoles = ["driver", "owner", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const existingUser = demoUsers.find((u) => u.email === email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = {
      id: demoUsers.length + 1,
      email,
      password_hash,
      full_name,
      phone,
      role,
      verification_status: "demo",
      created_at: new Date(),
    };
    demoUsers.push(newUser);
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || "demo_secret",
      { expiresIn: "7d" },
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Demo registration successful",
        data: {
          user: {
            id: newUser.id,
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
    res
      .status(500)
      .json({ success: false, message: "Demo registration failed" });
  }
};
/** * Login user (DEMO) */ exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }
    const user = demoUsers.find((u) => u.email === email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "demo_secret",
      { expiresIn: "7d" },
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
/** * Get profile (DEMO) */ exports.getProfile = async (req, res) => {
  const user = demoUsers.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      verification_status: "demo",
      created_at: user.created_at,
    },
  });
};
/** * Update profile (DEMO) */ exports.updateProfile = async (req, res) => {
  const user = demoUsers.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const { full_name, phone } = req.body;
  if (full_name) user.full_name = full_name;
  if (phone) user.phone = phone;
  res.json({ success: true, message: "Profile updated (demo)" });
};
