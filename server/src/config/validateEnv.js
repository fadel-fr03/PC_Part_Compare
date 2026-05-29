/**
 * Validates required environment variables at startup.
 * Call this before anything else in server.js so the process
 * exits immediately with a clear message instead of crashing
 * later with a cryptic undefined error.
 */
const validateEnv = () => {
  const required = [
    { key: "MONGO_URI",   hint: "MongoDB connection string from Atlas" },
    { key: "JWT_SECRET",  hint: "Long random string for signing tokens" },
  ];

  const missing = required.filter(({ key }) => !process.env[key]);

  if (missing.length > 0) {
    console.error("\n❌ Missing required environment variables:\n");
    missing.forEach(({ key, hint }) => {
      console.error(`   ${key.padEnd(20)} → ${hint}`);
    });
    console.error("\n   Copy .env.example to .env and fill in the values.\n");
    process.exit(1);
  }

  // Warn about weak JWT secret in production
  if (
    process.env.NODE_ENV === "production" &&
    process.env.JWT_SECRET.length < 32
  ) {
    console.warn("⚠️  JWT_SECRET is too short for production (< 32 chars). Use a longer secret.");
  }

  console.log("✅ Environment variables validated");
};

module.exports = validateEnv;
