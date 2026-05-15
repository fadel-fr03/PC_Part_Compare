const express = require("express");
const router = express.Router();
const {
  getAllParts,
  getPartById,
  compareParts,
} = require("../controllers/partsController");

// Get all parts with filtering/search
router.get("/", getAllParts);

// Compare parts
router.get("/compare", compareParts);
router.post("/compare", compareParts);

// Get single part by ID
router.get("/:id", getPartById);

module.exports = router;
