// Main Server Entry Point - Express Application
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Custom Middlewares
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Global Request Logger Middleware
app.use(requestLogger);

// API Base Routes (/api/v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// Catch-all 404 handler for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
    status: 404
  });
});

// Centralized Error Handling Middleware (must be registered last)
app.use(errorHandler);

// Start HTTP Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] DriveEasy Backend running on port ${PORT}`);
});

module.exports = app;
