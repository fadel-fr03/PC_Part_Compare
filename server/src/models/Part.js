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

module.exports = mongoose.model("Part", partSchema);
