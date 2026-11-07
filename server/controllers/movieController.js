const { db } = require('../config/db');

exports.getAllMovies = async (req, res) => {
  try {
    const { status } = req.query;
    const movies = await db.getMovies(status);
    res.json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving movies' });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await db.getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    const showtimes = await db.getShowtimesByMovieId(req.params.id);
    res.json({
      success: true,
      data: {
        ...movie,
        showtimes
      }
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving movie details' });
  }
};

exports.getShowtimeSeats = async (req, res) => {
  try {
    const showtime = await db.getShowtimeDetails(req.params.showtimeId);
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }
    const seats = await db.getSeatsForShowtime(req.params.showtimeId);
    res.json({
      success: true,
      showtime,
      seats
    });
  } catch (error) {
    console.error('Error fetching showtime seats:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving seats' });
  }
};
