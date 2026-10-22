// Booking Controller
// Handles booking creation, retrieval, and status updates
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

// Helper function to validate booking dates
const validateDates = (pickupDate, returnDate) => {
  const pickup = new Date(pickupDate);
  const dropoff = new Date(returnDate);

  if (isNaN(pickup.getTime()) || isNaN(dropoff.getTime())) {
    return 'Invalid date format';
  }
  if (dropoff <= pickup) {
    return 'Return date must be after pickup date';
  }
  return null;
};

// POST /api/v1/bookings
// Protected route: creates a booking and marks the vehicle as unavailable
const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, pickupDate, returnDate } = req.body;

    // Check required fields
    if (!vehicleId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID, pickup date, and return date are required',
        status: 400
      });
    }

    // Validate return date is after pickup date
    const dateError = validateDates(pickupDate, returnDate);
    if (dateError) {
      return res.status(400).json({
        success: false,
        message: dateError,
        status: 400
      });
    }

    // Find the vehicle to verify existence and check availability
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle not found',
        status: 400
      });
    }

    if (vehicle.available !== true) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not available for booking',
        status: 400
      });
    }

    // Create booking with customerId taken securely from authenticated JWT token
    const booking = await Booking.create({
      customerId: req.user.id,
      vehicleId: vehicle._id,
      pickupDate,
      returnDate,
      status: 'reserved'
    });

    // Mark vehicle as unavailable
    vehicle.available = false;
    await vehicle.save();

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/bookings/my
// Protected route: retrieves bookings for the logged-in customer
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate('customerId', 'name email')
      .populate('vehicleId', 'model type')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/bookings/:id/status
// Protected route: updates booking status and frees vehicle if completed/cancelled
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['reserved', 'ongoing', 'completed', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
        status: 400
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
        status: 404
      });
    }

    // Update status
    booking.status = status;
    await booking.save();

    // If completed or cancelled, make the vehicle available again
    if (status === 'completed' || status === 'cancelled') {
      await Vehicle.findByIdAndUpdate(booking.vehicleId, { available: true });
    }

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus
};
