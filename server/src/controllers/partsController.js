const { Part } = require("../models");

/**
 * @desc    Get all parts
 * @route   GET /api/parts
 * @access  Public
 */
exports.getAllParts = async (req, res) => {
  try {
    const parts = await Part.find({});

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
