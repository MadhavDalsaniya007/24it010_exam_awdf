// Booking Routes
const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const {
  createBooking,
  getMyBookings,
  updateBookingStatus
} = require('../controllers/bookingController');

// All booking routes require authentication
router.use(authGuard);

// POST /api/v1/bookings - Create new booking
router.post('/', createBooking);

// GET /api/v1/bookings/my - Get authenticated customer's bookings
router.get('/my', getMyBookings);

// PATCH /api/v1/bookings/:id/status - Update booking status
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
