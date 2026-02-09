const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    part: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      required: [true, "Part reference is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      minlength: [10, "Comment must be at least 10 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per user per part
reviewSchema.index({ user: 1, part: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
