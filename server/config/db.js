const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;
let isUsingMySQL = false;

// Initialize MySQL pool with connection test
async function initDatabase() {
  try {
    const testPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'mohasina_movie_db',
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000
    });

    const connection = await testPool.getConnection();
    await connection.ping();
    connection.release();
    pool = testPool;
    isUsingMySQL = true;
    console.log('✅ [Database] Connected successfully to MySQL (mohasina_movie_db)');
  } catch (err) {
    isUsingMySQL = false;
    console.log('ℹ️  [Database] MySQL not reachable at localhost:3306 (' + err.message + ')');
    console.log('⚡ [Database] Operating in High-Fidelity In-Memory Store pre-seeded with all movies, seats, and showtimes.');
  }
}

// Pre-seeded fallback data
const inMemoryData = {
  movies: [
    {
      movie_id: 1,
      title: 'Interstellar: Beyond Time',
      genre: 'Sci-Fi, Adventure, Drama',
      duration_mins: 169,
      release_date: '2024-10-15',
      language: 'English',
      rating: 8.7,
      age_rating: 'PG-13',
      synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
      poster_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
      trailer_url: 'https://www.youtube.com/embed/zSWdZVtXT7E',
      status: 'now_showing'
    },
    {
      movie_id: 2,
      title: 'Dune: Prophecy & Destiny',
      genre: 'Sci-Fi, Action, Epic',
      duration_mins: 166,
      release_date: '2024-11-01',
      language: 'English',
      rating: 8.6,
      age_rating: 'PG-13',
      synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between love and the fate of the universe.',
      poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      trailer_url: 'https://www.youtube.com/embed/Way9Dexny3w',
      status: 'now_showing'
    },
    {
      movie_id: 3,
      title: 'Spider-Verse: Across Dimensions',
      genre: 'Animation, Action, Sci-Fi',
      duration_mins: 140,
      release_date: '2024-10-20',
      language: 'English',
      rating: 8.9,
      age_rating: 'PG',
      synopsis: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence across infinite realities.',
      poster_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
      trailer_url: 'https://www.youtube.com/embed/cqGjhVJWtEg',
      status: 'now_showing'
    },
    {
      movie_id: 4,
      title: 'Oppenheimer: The Atomic Dawn',
      genre: 'Biography, Drama, History',
      duration_mins: 180,
      release_date: '2024-09-10',
      language: 'English',
      rating: 8.9,
      age_rating: 'R',
      synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
      poster_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80',
      trailer_url: 'https://www.youtube.com/embed/uYPbbksJxIg',
      status: 'now_showing'
    },
    {
      movie_id: 5,
      title: 'The Dark Knight Legacy',
      genre: 'Action, Crime, Thriller',
      duration_mins: 152,
      release_date: '2024-10-05',
      language: 'English',
      rating: 9.0,
      age_rating: 'PG-13',
      synopsis: 'When the menace known as the Joker wreaks havoc and chaos on Gotham City, Batman must accept one of the greatest psychological and physical tests.',
      poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      trailer_url: 'https://www.youtube.com/embed/EXeTwQWrcwY',
      status: 'now_showing'
    },
    {
      movie_id: 6,
      title: 'Inside Out: Emotional Waves',
      genre: 'Animation, Comedy, Family',
      duration_mins: 96,
      release_date: '2024-11-05',
      language: 'English',
      rating: 8.4,
      age_rating: 'PG',
      synopsis: 'Joy, Sadness, Anger, Fear and Disgust navigate the arrival of brand new emotions including Anxiety, Envy, and Ennui during teenage years.',
      poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
      trailer_url: 'https://www.youtube.com/embed/LEjhY15eCx0',
      status: 'now_showing'
    },
    {
      movie_id: 7,
      title: 'Avatar: Fire & Ash',
      genre: 'Sci-Fi, Adventure, Fantasy',
      duration_mins: 190,
      release_date: '2025-12-19',
      language: 'English',
      rating: 8.8,
      age_rating: 'PG-13',
      synopsis: 'Jake Sully and Neytiri travel to new biome regions of Pandora and encounter the Ash People, an aggressive clan of volcanic Na\'vi.',
      poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      trailer_url: 'https://www.youtube.com/embed/d9MyW72ELq0',
      status: 'coming_soon'
    },
    {
      movie_id: 8,
      title: 'Gladiator II: Rise of the Colosseum',
      genre: 'Action, Drama, History',
      duration_mins: 148,
      release_date: '2025-11-22',
      language: 'English',
      rating: 8.5,
      age_rating: 'R',
      synopsis: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after the emperors conquer his home.',
      poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
      trailer_url: 'https://www.youtube.com/embed/4rgYUipGJNo',
      status: 'coming_soon'
    }
  ],
  theaters: [
    {
      theater_id: 1,
      name: 'MOHASINA SIDDIKA Grand Cineplex',
      city: 'Metro City',
      address: 'Central Avenue, Promenade Mall, Level 4',
      contact_number: '+91 (080) 4567-8900'
    }
  ],
  screens: [
    {
      screen_id: 1,
      theater_id: 1,
      screen_name: 'Auditorium 1 - Dolby Atmos 4K',
      total_seats: 64
    }
  ],
  // Seats generator: A-H (8 rows), 1-8 per row = 64 seats
  seats: (function() {
    const list = [];
    let id = 1;
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (const r of rows) {
      let type = 'standard';
      if (['E', 'F', 'G'].includes(r)) type = 'premium';
      if (r === 'H') type = 'vip';
      for (let n = 1; n <= 8; n++) {
        list.push({
          seat_id: id++,
          screen_id: 1,
          row_label: r,
          seat_number: n,
          seat_type: type
        });
      }
    }
    return list;
  })(),
  showtimes: [
    { showtime_id: 1, movie_id: 1, screen_id: 1, show_date: 'Today', start_time: '10:30 AM', end_time: '01:19 PM', base_price: 250 },
    { showtime_id: 2, movie_id: 1, screen_id: 1, show_date: 'Today', start_time: '02:30 PM', end_time: '05:19 PM', base_price: 280 },
    { showtime_id: 3, movie_id: 1, screen_id: 1, show_date: 'Today', start_time: '06:45 PM', end_time: '09:34 PM', base_price: 320 },
    { showtime_id: 4, movie_id: 2, screen_id: 1, show_date: 'Today', start_time: '01:00 PM', end_time: '03:46 PM', base_price: 300 },
    { showtime_id: 5, movie_id: 2, screen_id: 1, show_date: 'Today', start_time: '07:30 PM', end_time: '10:16 PM', base_price: 350 },
    { showtime_id: 6, movie_id: 3, screen_id: 1, show_date: 'Today', start_time: '11:00 AM', end_time: '01:20 PM', base_price: 260 },
    { showtime_id: 7, movie_id: 3, screen_id: 1, show_date: 'Today', start_time: '04:00 PM', end_time: '06:20 PM', base_price: 290 },
    { showtime_id: 8, movie_id: 4, screen_id: 1, show_date: 'Today', start_time: '08:15 PM', end_time: '11:15 PM', base_price: 320 },
    { showtime_id: 9, movie_id: 5, screen_id: 1, show_date: 'Today', start_time: '03:00 PM', end_time: '05:32 PM', base_price: 280 },
    { showtime_id: 10, movie_id: 6, screen_id: 1, show_date: 'Today', start_time: '12:00 PM', end_time: '01:36 PM', base_price: 240 }
  ],
  bookings: [
    {
      booking_id: 1,
      booking_ref: 'MSB-74892',
      user_id: 2,
      showtime_id: 1,
      customer_name: 'Sarah Jenkins',
      customer_email: 'sarah.j@example.com',
      customer_phone: '+91 9811223344',
      total_amount: 500,
      booking_status: 'confirmed',
      booking_time: new Date().toISOString(),
      seats: ['A3', 'A4'],
      seat_ids: [3, 4],
      payment_method: 'UPI / NetBanking'
    },
    {
      booking_id: 2,
      booking_ref: 'MSB-91024',
      user_id: 3,
      showtime_id: 1,
      customer_name: 'Rahul Sharma',
      customer_email: 'rahul.sharma@example.com',
      customer_phone: '+91 9822334455',
      total_amount: 672,
      booking_status: 'confirmed',
      booking_time: new Date().toISOString(),
      seats: ['E4', 'E5'],
      seat_ids: [36, 37],
      payment_method: 'Credit Card'
    }
  ]
};

// Data access operations
const db = {
  isUsingMySQL: () => isUsingMySQL,

  async getMovies(status = null) {
    if (isUsingMySQL) {
      const sql = status ? 'SELECT * FROM movies WHERE status = ?' : 'SELECT * FROM movies';
      const [rows] = await pool.query(sql, status ? [status] : []);
      return rows;
    }
    if (status) {
      return inMemoryData.movies.filter(m => m.status === status);
    }
    return inMemoryData.movies;
  },

  async getMovieById(id) {
    const numId = Number(id);
    if (isUsingMySQL) {
      const [rows] = await pool.query('SELECT * FROM movies WHERE movie_id = ?', [numId]);
      return rows[0] || null;
    }
    return inMemoryData.movies.find(m => m.movie_id === numId) || null;
  },

  async getShowtimesByMovieId(movieId) {
    const numId = Number(movieId);
    if (isUsingMySQL) {
      const [rows] = await pool.query(`
        SELECT st.*, s.screen_name, t.name as theater_name
        FROM showtimes st
        JOIN screens s ON st.screen_id = s.screen_id
        JOIN theaters t ON s.theater_id = t.theater_id
        WHERE st.movie_id = ?
        ORDER BY st.start_time ASC
      `, [numId]);
      return rows;
    }
    return inMemoryData.showtimes
      .filter(st => st.movie_id === numId)
      .map(st => {
        const screen = inMemoryData.screens.find(s => s.screen_id === st.screen_id);
        const theater = inMemoryData.theaters.find(t => t.theater_id === screen.theater_id);
        return {
          ...st,
          screen_name: screen.screen_name,
          theater_name: theater.name
        };
      });
  },

  async getShowtimeDetails(showtimeId) {
    const numId = Number(showtimeId);
    if (isUsingMySQL) {
      const [rows] = await pool.query(`
        SELECT st.*, m.title as movie_title, m.poster_url, m.age_rating, m.duration_mins,
               s.screen_name, t.name as theater_name, t.address as theater_address
        FROM showtimes st
        JOIN movies m ON st.movie_id = m.movie_id
        JOIN screens s ON st.screen_id = s.screen_id
        JOIN theaters t ON s.theater_id = t.theater_id
        WHERE st.showtime_id = ?
      `, [numId]);
      return rows[0] || null;
    }

    const st = inMemoryData.showtimes.find(s => s.showtime_id === numId);
    if (!st) return null;
    const movie = inMemoryData.movies.find(m => m.movie_id === st.movie_id);
    const screen = inMemoryData.screens.find(s => s.screen_id === st.screen_id);
    const theater = inMemoryData.theaters.find(t => t.theater_id === screen.theater_id);

    return {
      ...st,
      movie_title: movie.title,
      poster_url: movie.poster_url,
      age_rating: movie.age_rating,
      duration_mins: movie.duration_mins,
      screen_name: screen.screen_name,
      theater_name: theater.name,
      theater_address: theater.address
    };
  },

  async getSeatsForShowtime(showtimeId) {
    const numId = Number(showtimeId);
    if (isUsingMySQL) {
      const [allSeats] = await pool.query(`
        SELECT s.*, 
               CASE WHEN bs.seat_id IS NOT NULL THEN 1 ELSE 0 END as is_booked
        FROM showtimes st
        JOIN seats s ON st.screen_id = s.screen_id
        LEFT JOIN (
          SELECT bs.seat_id 
          FROM bookings b
          JOIN booking_seats bs ON b.booking_id = bs.booking_id
          WHERE b.showtime_id = ? AND b.booking_status = 'confirmed'
        ) bs ON s.seat_id = bs.seat_id
        WHERE st.showtime_id = ?
        ORDER BY s.row_label ASC, s.seat_number ASC
      `, [numId, numId]);
      return allSeats;
    }

    // In-memory calculation
    const bookedSeatIds = new Set();
    inMemoryData.bookings
      .filter(b => b.showtime_id === numId && b.booking_status === 'confirmed')
      .forEach(b => {
        (b.seat_ids || []).forEach(id => bookedSeatIds.add(id));
      });

    return inMemoryData.seats.map(seat => ({
      ...seat,
      is_booked: bookedSeatIds.has(seat.seat_id) ? 1 : 0
    }));
  },

  async createBooking({ showtimeId, customerName, customerEmail, customerPhone, seatIds, paymentMethod = 'UPI / NetBanking' }) {
    const numShowtimeId = Number(showtimeId);
    const showtime = await this.getShowtimeDetails(numShowtimeId);
    if (!showtime) throw new Error('Showtime not found');

    const bookingRef = 'MSB-' + Math.floor(10000 + Math.random() * 90000);
    const numericSeatIds = seatIds.map(Number);

    // Calculate total amount based on seat tiers
    let total = 0;
    const reservedSeatsInfo = [];
    const base = Number(showtime.base_price) || 250;

    for (const seatId of numericSeatIds) {
      const seat = inMemoryData.seats.find(s => s.seat_id === seatId) || { row_label: 'A', seat_number: seatId, seat_type: 'standard' };
      let seatPrice = base;
      if (seat.seat_type === 'premium') seatPrice = Math.round(base * 1.20);
      if (seat.seat_type === 'vip') seatPrice = Math.round(base * 1.50);
      total += seatPrice;
      reservedSeatsInfo.push({
        seat_id: seatId,
        label: `${seat.row_label}${seat.seat_number}`,
        type: seat.seat_type,
        price: seatPrice
      });
    }

    if (isUsingMySQL) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Check if any seat is already booked for this showtime
        const [existing] = await connection.query(`
          SELECT bs.seat_id FROM bookings b
          JOIN booking_seats bs ON b.booking_id = bs.booking_id
          WHERE b.showtime_id = ? AND b.booking_status = 'confirmed' AND bs.seat_id IN (?)
        `, [numShowtimeId, numericSeatIds]);

        if (existing.length > 0) {
          throw new Error('One or more selected seats have just been reserved by another customer.');
        }

        const [bookingResult] = await connection.query(`
          INSERT INTO bookings (booking_ref, showtime_id, customer_name, customer_email, customer_phone, total_amount, booking_status)
          VALUES (?, ?, ?, ?, ?, ?, 'confirmed')
        `, [bookingRef, numShowtimeId, customerName, customerEmail, customerPhone, total]);

        const bookingId = bookingResult.insertId;

        for (const seatInfo of reservedSeatsInfo) {
          await connection.query(`
            INSERT INTO booking_seats (booking_id, seat_id, price_paid)
            VALUES (?, ?, ?)
          `, [bookingId, seatInfo.seat_id, seatInfo.price]);
        }

        const txnRef = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        await connection.query(`
          INSERT INTO payments (booking_id, payment_method, transaction_ref, amount, payment_status)
          VALUES (?, ?, ?, ?, 'completed')
        `, [bookingId, paymentMethod, txnRef, total]);

        await connection.commit();

        return {
          booking_id: bookingId,
          booking_ref: bookingRef,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          showtime,
          total_amount: total,
          seats: reservedSeatsInfo.map(s => s.label),
          payment_method: paymentMethod,
          transaction_ref: txnRef,
          booking_time: new Date().toISOString()
        };
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
      }
    }

    // In-Memory store handling
    const newBooking = {
      booking_id: inMemoryData.bookings.length + 1,
      booking_ref: bookingRef,
      user_id: null,
      showtime_id: numShowtimeId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      total_amount: total,
      booking_status: 'confirmed',
      booking_time: new Date().toISOString(),
      seats: reservedSeatsInfo.map(s => s.label),
      seat_ids: numericSeatIds,
      payment_method: paymentMethod,
      transaction_ref: 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      showtime
    };

    inMemoryData.bookings.push(newBooking);
    return newBooking;
  },

  async getBookingByRef(bookingRef) {
    if (isUsingMySQL) {
      const [rows] = await pool.query(`
        SELECT b.*, st.show_date, st.start_time, m.title as movie_title, m.poster_url,
               s.screen_name, t.name as theater_name, t.address as theater_address,
               p.payment_method, p.transaction_ref
        FROM bookings b
        JOIN showtimes st ON b.showtime_id = st.showtime_id
        JOIN movies m ON st.movie_id = m.movie_id
        JOIN screens s ON st.screen_id = s.screen_id
        JOIN theaters t ON s.theater_id = t.theater_id
        LEFT JOIN payments p ON b.booking_id = p.booking_id
        WHERE b.booking_ref = ?
      `, [bookingRef]);

      if (rows.length === 0) return null;
      const booking = rows[0];

      const [seats] = await pool.query(`
        SELECT CONCAT(s.row_label, s.seat_number) as seat_label, bs.price_paid, s.seat_type
        FROM booking_seats bs
        JOIN seats s ON bs.seat_id = s.seat_id
        WHERE bs.booking_id = ?
      `, [booking.booking_id]);

      booking.seats = seats.map(s => s.seat_label);
      return booking;
    }

    const booking = inMemoryData.bookings.find(b => b.booking_ref.toUpperCase() === bookingRef.toUpperCase());
    if (!booking) return null;

    const showtime = await this.getShowtimeDetails(booking.showtime_id);
    return {
      ...booking,
      show_date: showtime.show_date,
      start_time: showtime.start_time,
      movie_title: showtime.movie_title,
      poster_url: showtime.poster_url,
      screen_name: showtime.screen_name,
      theater_name: showtime.theater_name,
      theater_address: showtime.theater_address
    };
  },

  async getAllBookings() {
    if (isUsingMySQL) {
      const [rows] = await pool.query(`
        SELECT b.*, m.title as movie_title, st.show_date, st.start_time
        FROM bookings b
        JOIN showtimes st ON b.showtime_id = st.showtime_id
        JOIN movies m ON st.movie_id = m.movie_id
        ORDER BY b.booking_id DESC
      `);
      return rows;
    }
    return inMemoryData.bookings.map(b => {
      const st = inMemoryData.showtimes.find(s => s.showtime_id === b.showtime_id);
      const m = inMemoryData.movies.find(movie => movie.movie_id === (st ? st.movie_id : 1));
      return {
        ...b,
        movie_title: m ? m.title : 'Movie',
        show_date: st ? st.show_date : 'Today',
        start_time: st ? st.start_time : '12:00 PM'
      };
    });
  }
};

module.exports = {
  initDatabase,
  db
};
