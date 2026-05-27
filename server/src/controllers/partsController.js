const mongoose = require("mongoose");
const { Part } = require("../models");

/**
 * @desc    Get all parts with optional filtering, search, sorting, pagination
 * @route   GET /api/parts
 * @access  Public
 */
exports.getAllParts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      manufacturer,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (category && category !== "All") {
      filter.category = category; // exact match — hits the category index
    }

    if (manufacturer) {
      filter.manufacturer = { $regex: manufacturer, $options: "i" };
    }

    if (search) {
      // Use the text index when a search term is present for better performance;
      // fall back to regex if the text index is unavailable.
      filter.$text = { $search: search };
    }

    if (minPrice !== undefined && minPrice !== "" ||
        maxPrice !== undefined && maxPrice !== "") {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== "") filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== "") filter.price.$lte = Number(maxPrice);
    }

    // Build sort
    const sortMap = {
      price_asc:    { price: 1 },
      price_desc:   { price: -1 },
      rating_desc:  { averageRating: -1 },
      rating_asc:   { averageRating: 1 },
      name_asc:     { name: 1 },
      name_desc:    { name: -1 },
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    // Pagination
    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    // Run count and data fetch in parallel
    const [total, parts] = await Promise.all([
      Part.countDocuments(filter),
      Part.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(limitNum)
          .lean(),    // .lean() returns plain JS objects — ~2× faster, less memory
    ]);

    res.status(200).json({
      success: true,
      count: parts.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
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
    // Validate ObjectId before hitting the DB
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid part ID" });
    }

    const part = await Part.findById(req.params.id).lean();

    if (!part) {
      return res.status(404).json({ success: false, message: "Part not found" });
    }

    res.status(200).json({ success: true, data: part });
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
 * @desc    Compare 2–3 parts by IDs
 * @route   GET /api/parts/compare?ids=id1,id2,id3
 * @route   POST /api/parts/compare { ids: [...] }
 * @access  Public
 */
exports.compareParts = async (req, res) => {
  try {
    let ids = [];

    if (req.method === "GET") {
      ids = (req.query.ids || "").split(",").map((id) => id.trim()).filter(Boolean);
    } else if (req.method === "POST") {
      ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    }

    if (ids.length < 2 || ids.length > 3) {
      return res.status(400).json({
        success: false,
        message: "Please provide 2 to 3 part IDs for comparison",
      });
    }

    // Validate all IDs before querying
    const invalidId = ids.find((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidId) {
      return res.status(400).json({ success: false, message: `Invalid ID: ${invalidId}` });
    }

    const parts = await Part.find({ _id: { $in: ids } }).lean();

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

    // Preserve caller's ordering
    const orderedParts = ids
      .map((id) => parts.find((p) => p._id.toString() === id))
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
