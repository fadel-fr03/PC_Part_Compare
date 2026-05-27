const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));

// ─── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Static Media ──────────────────────────────────────────────────────────────
app.use(
  "/media",
  express.static(path.join(__dirname, "Media"))
);

// ─── Rate limiters ─────────────────────────────────────────────────────────────

/**
 * Global limiter — broad safety net for all /api routes.
 * 200 requests per minute per IP.
 */
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 200,
  standardHeaders: true,     // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down and try again shortly.",
  },
});

/**
 * Auth limiter — prevents brute-force on login/register.
 * 10 attempts per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  },
});

/**
 * Write limiter — limits review creation/updates to prevent spam.
 * 20 write actions per 10 minutes per IP.
 */
const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many write requests. Please wait before submitting again.",
  },
});

/**
 * Read limiter — generous limit for browsing/searching parts.
 * 300 requests per minute per IP.
 */
const readLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
});

// ─── Apply rate limiters ───────────────────────────────────────────────────────

// Global safety net
app.use("/api", globalLimiter);

// Stricter limit on auth endpoints
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Read endpoints — generous
app.use("/api/parts", readLimiter);

// Write endpoints — restrictive
app.use("/api/reviews", (req, res, next) => {
  // Only rate-limit mutating methods; reads stay under globalLimiter
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    return writeLimiter(req, res, next);
  }
  next();
});

// ─── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PC Part Compare API is running",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ────────────────────────────────────────────────────────────────────
const routes = require("./routes");
app.use("/api", routes);

module.exports = app;
