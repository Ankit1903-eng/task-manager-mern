// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

// ✅ ONLY AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;