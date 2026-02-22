const express = require("express");
const router = express.Router();
const { getAllParts, getPartById } = require("../controllers/partsController");

// Get all parts
router.get("/", getAllParts);

// Get single part by ID
router.get("/:id", getPartById);

module.exports = router;
