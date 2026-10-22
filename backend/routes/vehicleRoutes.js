// Vehicle Fleet Routes
const express = require('express');
const router = express.Router();
const { getAllVehicles } = require('../controllers/vehicleController');

// GET /api/v1/vehicles (Public)
router.get('/', getAllVehicles);

module.exports = router;
