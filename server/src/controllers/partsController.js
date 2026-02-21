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
