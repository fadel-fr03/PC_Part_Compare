const express = require("express");
const router = express.Router();

const {
  getReviewsByPart,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/auth");

// Public - get reviews for a part
router.get("/:partId", getReviewsByPart);

// Private - add review
router.post("/", protect, addReview);

// Private - update own review
router.put("/:id", protect, updateReview);

// Private - delete own review or admin
router.delete("/:id", protect, deleteReview);

module.exports = router;