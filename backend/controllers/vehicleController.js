// Vehicle Controller
// Handles fetching available and all vehicles
const Vehicle = require('../models/Vehicle');

// GET /api/v1/vehicles
// Public endpoint to retrieve all vehicles in the fleet
const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVehicles
};
