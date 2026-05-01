const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 Protect Middleware
const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Authorization header check
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user (without password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      // Attach user to request
      req.user = user;

      next();
    } else {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      message: "Token failed",
      error: error.message,
    });
  }
};

// 🔐 Admin Only Middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied, admin only",
    });
  }
};

module.exports = { protect, adminOnly };