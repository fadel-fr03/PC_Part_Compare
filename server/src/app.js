const express = require("express");
const cors = require("cors");

const app = express();

// CORS configuration — allow localhost dev + any deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,        // set this on Render
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Global middleware
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "PC Part Compare API is running",
    timestamp: new Date().toISOString()
  });
});

// Routes
const routes = require("./routes");
app.use("/api", routes);

module.exports = app;
