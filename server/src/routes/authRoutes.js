const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { register, login, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Register route with validation
router.post(
  "/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  register
);

// Login route with validation
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email"),
    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  validateRequest,
  login
);

// Logout route (protected)
router.post("/logout", protect, logout);

// Get current user route (protected)
router.get("/me", protect, getMe);

module.exports = router;
