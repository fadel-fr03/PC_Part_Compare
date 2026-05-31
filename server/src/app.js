const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
    : []),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: "Too many authentication attempts. Try again in 15 minutes." },
});

const readLimiter = rateLimit({
  windowMs: 60 * 1000, max: 300,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
});

const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, max: 20,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: "Too many write requests. Please wait before submitting again." },
});

app.use("/api", globalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/parts", readLimiter);
app.use("/api/reviews", (req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) return writeLimiter(req, res, next);
  next();
});

// ─── Swagger UI (mounted at /api-docs, NOT under /api) ────────────────────────
try {
  const swaggerRoute = require("./routes/swaggerRoute");
  app.use("/api-docs", swaggerRoute);
  console.log("📄 API docs available at /api-docs");
} catch (err) {
  console.warn("⚠️  Swagger UI not available:", err.message);
  console.warn("   Run: npm install swagger-ui-express js-yaml");
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PC Part Compare API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    docs: "/api-docs",
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const routes = require("./routes");
app.use("/api", routes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

module.exports = app;
