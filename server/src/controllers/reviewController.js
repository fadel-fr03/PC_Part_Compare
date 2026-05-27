const mongoose = require("mongoose");
const { Review, Part } = require("../models");

/**
 * Uses a single aggregation pipeline instead of fetching all reviews
 * into memory and reducing in JS — much faster at scale.
 */
const updatePartAverageRating = async (partId) => {
  const result = await Review.aggregate([
    { $match: { part: new mongoose.Types.ObjectId(partId) } },
    { $group: { _id: "$part", avg: { $avg: "$rating" } } },
  ]);

  const averageRating = result.length > 0
    ? Math.round(result[0].avg * 10) / 10   // round to 1 decimal
    : 0;

  await Part.findByIdAndUpdate(partId, { averageRating });
};

/**
 * @desc    Get reviews for a specific part
 * @route   GET /api/reviews/:partId
 * @access  Public
 */
exports.getReviewsByPart = async (req, res) => {
  try {
    const { partId } = req.params;
    const { sort = "newest" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(partId)) {
      return res.status(400).json({ success: false, message: "Invalid part ID" });
    }

    // Verify part exists (lean — no need for a full Mongoose document)
    const partExists = await Part.exists({ _id: partId });
    if (!partExists) {
      return res.status(404).json({ success: false, message: "Part not found" });
    }

    const sortMap = {
      newest:      { createdAt: -1 },
      highest:     { rating: -1, createdAt: -1 },
      mostHelpful: { helpfulCount: -1, createdAt: -1 },
    };
    const sortOption = sortMap[sort] || sortMap.newest;

    const reviews = await Review.find({ part: partId })
      .populate("user", "_id username")
      .sort(sortOption)
      .lean();

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

/**
 * @desc    Add a review
 * @route   POST /api/reviews
 * @access  Private
 */
exports.addReview = async (req, res) => {
  try {
    const { partId, rating, comment } = req.body;

    if (!partId || rating === undefined || !comment) {
      return res.status(400).json({
        success: false,
        message: "partId, rating, and comment are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(partId)) {
      return res.status(400).json({ success: false, message: "Invalid part ID" });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const partExists = await Part.exists({ _id: partId });
    if (!partExists) {
      return res.status(404).json({ success: false, message: "Part not found" });
    }

    // The unique index on {user, part} will catch duplicates at the DB level,
    // but a pre-check gives a friendlier error message before the write attempt.
    const duplicate = await Review.exists({ user: req.user._id, part: partId });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this part",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      part: partId,
      rating: ratingNum,
      comment,
    });

    // Update average in the background — no need to await before responding,
    // but we do want errors surfaced in logs.
    updatePartAverageRating(partId).catch((err) =>
      console.error("updatePartAverageRating error:", err)
    );

    const populatedReview = await Review.findById(review._id)
      .populate("user", "_id username")
      .lean();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: populatedReview,
    });
  } catch (error) {
    console.error("Add review error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this part",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};

/**
 * @desc    Update own review
 * @route   PUT /api/reviews/:id
 * @access  Private (owner only)
 */
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid review ID" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own review",
      });
    }

    if (rating !== undefined) {
      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      review.rating = ratingNum;
    }

    if (comment !== undefined) {
      if (comment.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message: "Comment must be at least 10 characters",
        });
      }
      review.comment = comment;
    }

    await review.save();

    updatePartAverageRating(review.part).catch((err) =>
      console.error("updatePartAverageRating error:", err)
    );

    const populatedReview = await Review.findById(review._id)
      .populate("user", "_id username")
      .lean();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: populatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete review (owner or admin)
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid review ID" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review",
      });
    }

    const partId = review.part;
    await Review.findByIdAndDelete(id);

    updatePartAverageRating(partId).catch((err) =>
      console.error("updatePartAverageRating error:", err)
    );

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};
