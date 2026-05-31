const express = require("express");
const router = express.Router();

const {
  getAllParts,
  getPartById,
  compareParts,
  createPart,
  updatePart,
  deletePart,
} = require("../controllers/partsController");

const { protect, adminOnly } = require("../middleware/auth");

// Public routes
router.get("/", getAllParts);
router.get("/compare", compareParts);
router.post("/compare", compareParts);
router.get("/:id", getPartById);

// Admin-only routes
router.post("/", protect, adminOnly, createPart);
router.put("/:id", protect, adminOnly, updatePart);
router.delete("/:id", protect, adminOnly, deletePart);

module.exports = router;
