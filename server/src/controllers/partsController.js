const { Part } = require("../models");

/**
 * @desc    Get all parts with optional filtering/search
 * @route   GET /api/parts
 * @access  Public
 */
exports.getAllParts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, manufacturer, sort } = req.query;

    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (manufacturer) {
      filter.manufacturer = { $regex: manufacturer, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { manufacturer: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== "") {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== "") {
        filter.price.$lte = Number(maxPrice);
      }
    }

    let query = Part.find(filter);

    switch (sort) {
      case "price_asc":
        query = query.sort({ price: 1 });
        break;
      case "price_desc":
        query = query.sort({ price: -1 });
        break;
      case "rating_desc":
        query = query.sort({ averageRating: -1 });
        break;
      case "rating_asc":
        query = query.sort({ averageRating: 1 });
        break;
      case "name_asc":
        query = query.sort({ name: 1 });
        break;
      case "name_desc":
        query = query.sort({ name: -1 });
        break;
      default:
        query = query.sort({ createdAt: -1 });
    }

    const parts = await query;

    res.status(200).json({
      success: true,
      count: parts.length,
      data: parts,
    });
  } catch (error) {
    console.error("Get all parts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch parts",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single part by ID
 * @route   GET /api/parts/:id
 * @access  Public
 */
exports.getPartById = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);

    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    res.status(200).json({
      success: true,
      data: part,
    });
  } catch (error) {
    console.error("Get part by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch part",
      error: error.message,
    });
  }
};

/**
 * @desc    Compare 2 to 3 parts by IDs
 * @route   GET /api/parts/compare?ids=id1,id2,id3
 * @route   POST /api/parts/compare
 * @access  Public
 */
exports.compareParts = async (req, res) => {
  try {
    let ids = [];

    if (req.method === "GET") {
      ids = (req.query.ids || "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
    } else if (req.method === "POST") {
      ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    }

    if (ids.length < 2 || ids.length > 3) {
      return res.status(400).json({
        success: false,
        message: "Please provide 2 to 3 part IDs for comparison",
      });
    }

    const parts = await Part.find({ _id: { $in: ids } });

    if (parts.length !== ids.length) {
      return res.status(404).json({
        success: false,
        message: "One or more parts were not found",
      });
    }

    const categories = [...new Set(parts.map((p) => p.category))];
    if (categories.length > 1) {
      return res.status(400).json({
        success: false,
        message: "You can only compare parts from the same category",
      });
    }

    const orderedParts = ids
      .map((id) => parts.find((p) => p._id.toString() === id.toString()))
      .filter(Boolean);

    res.status(200).json({
      success: true,
      count: orderedParts.length,
      data: orderedParts,
    });
  } catch (error) {
    console.error("Compare parts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to compare parts",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new part
 * @route   POST /api/parts
 * @access  Private/Admin
 */
exports.createPart = async (req, res) => {
  try {
    const {
      name,
      category,
      manufacturer,
      price,
      specifications,
      imageUrl,
    } = req.body;

    if (!name || !category || !manufacturer || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "name, category, manufacturer, and price are required",
      });
    }

    const part = await Part.create({
      name,
      category,
      manufacturer,
      price: Number(price),
      specifications: specifications || {},
      imageUrl: imageUrl || "",
    });

    res.status(201).json({
      success: true,
      message: "Part created successfully",
      data: part,
    });
  } catch (error) {
    console.error("Create part error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create part",
      error: error.message,
    });
  }
};

/**
 * @desc    Update part
 * @route   PUT /api/parts/:id
 * @access  Private/Admin
 */
exports.updatePart = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPart = await Part.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPart) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Part updated successfully",
      data: updatedPart,
    });
  } catch (error) {
    console.error("Update part error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update part",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete part
 * @route   DELETE /api/parts/:id
 * @access  Private/Admin
 */
exports.deletePart = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPart = await Part.findByIdAndDelete(id);

    if (!deletedPart) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Part deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete part error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete part",
      error: error.message,
    });
  }
};
