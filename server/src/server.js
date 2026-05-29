require('dotenv').config();

// Validate env vars FIRST — before any other imports that might use them
const validateEnv = require('./config/validateEnv');
validateEnv();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
