
// Express server entry point — connects to MongoDB Atlas and starts the API

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas before starting the server
connectDB();

const app = express();

// ─── Middleware ──────
// Enable CORS so the React Native app can communicate with this server
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ─── Routes ─────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tasker API is running' });
});

// ─── 404 Handler ──────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ───────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ─── Start Server ─────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
