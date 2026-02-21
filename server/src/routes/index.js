const express = require("express");
const router = express.Router();

const { healthCheck } = require("../controllers/healthController");
const authRoutes = require("./authRoutes");
const partsRoutes = require("./partsRoutes");

// Health check route
router.get("/health", healthCheck);

// Auth routes
router.use("/auth", authRoutes);

// Parts routes
router.use("/parts", partsRoutes);

module.exports = router;
