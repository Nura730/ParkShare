const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(
      "DEBUG: Token received:",
      token ? token.substring(0, 10) + "..." : "None",
    );

    if (!token) {
      console.log("DEBUG: No token provided");
      return res.status(401).json({
        success: false,
        message: "No authentication token, access denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(
      "DEBUG: Token verified for user:",
      decoded.id,
      "role:",
      decoded.role,
    );
    req.user = decoded;
    next();
  } catch (error) {
    console.log("DEBUG: Token verification failed:", error.message);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

module.exports = auth;
