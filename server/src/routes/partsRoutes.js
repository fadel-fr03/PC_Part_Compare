const express = require("express");
const router = express.Router();
const { getAllParts } = require("../controllers/partsController");

// Get all parts
router.get("/", getAllParts);

module.exports = router;
