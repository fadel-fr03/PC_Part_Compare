const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    part: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      required: [true, "Part reference is required"],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      index: true,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      minlength: [10, "Comment must be at least 10 characters"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, part: 1 }, { unique: true });
reviewSchema.index({ part: 1, createdAt: -1 });
reviewSchema.index({ part: 1, rating: -1 });
reviewSchema.index({ part: 1, helpfulCount: -1 });

module.exports =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
