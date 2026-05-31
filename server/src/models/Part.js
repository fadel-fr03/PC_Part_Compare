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
      index: true,
    },
    manufacturer: {
      type: String,
      required: [true, "Manufacturer is required"],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      index: true,
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
      index: true,
    },
  },
  { timestamps: true }
);

partSchema.index({ name: "text", manufacturer: "text" });
partSchema.index({ category: 1, price: 1 });
partSchema.index({ category: 1, averageRating: -1 });
partSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Part || mongoose.model("Part", partSchema);
