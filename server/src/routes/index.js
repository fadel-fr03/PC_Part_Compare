const express = require("express");
const router = express.Router();

const { healthCheck } = require("../controllers/healthController");
const authRoutes = require("./authRoutes");
const partsRoutes = require("./partsRoutes");
const reviewRoutes = require("./reviewRoutes");

// Health check
router.get("/health", healthCheck);

// Auth
router.use("/auth", authRoutes);

// Parts
router.use("/parts", partsRoutes);

// Reviews
router.use("/reviews", reviewRoutes);

const swaggerRoute = require('./swaggerRoute');
router.use('/api-docs', swaggerRoute);

module.exports = router;
