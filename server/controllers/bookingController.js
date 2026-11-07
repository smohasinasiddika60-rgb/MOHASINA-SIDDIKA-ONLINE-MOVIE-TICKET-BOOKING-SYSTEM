const { db } = require('../config/db');

exports.createBooking = async (req, res) => {
  try {
    const { showtimeId, customerName, customerEmail, customerPhone, seatIds, paymentMethod } = req.body;

    if (!showtimeId || !customerName || !customerEmail || !customerPhone || !seatIds || !seatIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: showtimeId, customerName, customerEmail, customerPhone, and at least one seat.'
      });
    }

    const booking = await db.createBooking({
      showtimeId,
      customerName,
      customerEmail,
      customerPhone,
      seatIds,
      paymentMethod: paymentMethod || 'UPI / NetBanking'
    });

    res.status(201).json({
      success: true,
      message: 'Tickets reserved successfully!',
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to process booking'
    });
  }
};

exports.getBookingByRef = async (req, res) => {
  try {
    const { ref } = req.params;
    const booking = await db.getBookingByRef(ref);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking found for reference "${ref}"`
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error finding booking:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving booking' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await db.getAllBookings();
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving bookings' });
  }
};
