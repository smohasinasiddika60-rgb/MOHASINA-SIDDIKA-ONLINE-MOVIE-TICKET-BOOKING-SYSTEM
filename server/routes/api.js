const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const bookingController = require('../controllers/bookingController');
const { db } = require('../config/db');

// Movie Endpoints
router.get('/movies', movieController.getAllMovies);
router.get('/movies/:id', movieController.getMovieById);
router.get('/showtimes/:showtimeId/seats', movieController.getShowtimeSeats);

// Booking Endpoints
router.post('/bookings', bookingController.createBooking);
router.get('/bookings/:ref', bookingController.getBookingByRef);
router.get('/bookings', bookingController.getAllBookings);

// System Status Endpoint
router.get('/system/status', async (req, res) => {
  const isMySQL = db.isUsingMySQL();
  const movies = await db.getMovies();
  const bookings = await db.getAllBookings();
  res.json({
    system: 'MOHASINA SIDDIKA Online Movie Ticket Booking API',
    version: '1.0.0',
    database_mode: isMySQL ? 'MySQL Database (Live)' : 'Integrated High-Fidelity In-Memory Store (Auto-Fallback)',
    stats: {
      total_movies: movies.length,
      total_bookings: bookings.length
    }
  });
});

module.exports = router;
