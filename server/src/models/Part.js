const mongoose = require("mongoose");

const partSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Part name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["CPU", "GPU", "RAM", "Motherboard", "Storage", "PSU", "Case", "Cooling"],
    },
    manufacturer: {
      type: String,
      required: [true, "Manufacturer is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    imageUrl: {
      type: String,
      default: "",
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────

// Primary filter fields used in getAllParts (category, manufacturer, price range)
partSchema.index({ category: 1 });
partSchema.index({ manufacturer: 1 });
partSchema.index({ price: 1 });
partSchema.index({ averageRating: -1 });

// Compound index covers the most common query pattern:
// filter by category + sort by price or rating
partSchema.index({ category: 1, price: 1 });
partSchema.index({ category: 1, averageRating: -1 });

// Full-text search on name and manufacturer (used by the search param)
partSchema.index({ name: "text", manufacturer: "text" });

// ──────────────────────────────────────────────────────────────────────────────

module.exports = mongoose.model("Part", partSchema);
