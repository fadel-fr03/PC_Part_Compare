const express = require("express");

const app = express();

// Global middleware
app.use(express.json());

// Routes
const routes = require("./routes");
app.use("/api", routes);

module.exports = app;
