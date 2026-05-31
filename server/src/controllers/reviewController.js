const { Review, Part } = require("../models");

/**
 * Recalculate part average rating
 */
const updatePartAverageRating = async (partId) => {
  const reviews = await Review.find({ part: partId });

  let averageRating = 0;

  if (reviews.length > 0) {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    averageRating = total / reviews.length;
  }

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

    const part = await Part.findById(partId);
    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    let sortOption = { createdAt: -1 };

    if (sort === "highest") {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sort === "mostHelpful") {
      sortOption = { helpfulCount: -1, createdAt: -1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find({ part: partId })
      .populate("user", "_id username")
      .sort(sortOption);

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
 * @desc    Add review
 * @route   POST /api/reviews
 * @access  Private
 */
exports.addReview = async (req, res) => {
  try {
    const { partId, rating, comment } = req.body;

    if (!partId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "partId, rating, and comment are required",
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const part = await Part.findById(partId);
    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      part: partId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this part",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      part: partId,
      rating: Number(rating),
      comment,
    });

    await updatePartAverageRating(partId);

    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "_id username"
    );

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
        message: "You already reviewed this part",
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
 * @desc    Update review
 * @route   PUT /api/reviews/:id
 * @access  Private (owner only)
 */
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own review",
      });
    }

    if (rating !== undefined) {
      if (Number(rating) < 1 || Number(rating) > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      review.rating = Number(rating);
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
    await updatePartAverageRating(review.part);

    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "_id username"
    );

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
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private (owner or admin)
 */
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review unless you are admin",
      });
    }

    const partId = review.part;

    await Review.findByIdAndDelete(id);
    await updatePartAverageRating(partId);

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