const express = require("express");
const router = express.Router();

const { healthCheck } = require("../controllers/healthController");
const authRoutes = require("./authRoutes");

// Health check route
router.get("/health", healthCheck);

// Auth routes
router.use("/auth", authRoutes);

module.exports = router;
