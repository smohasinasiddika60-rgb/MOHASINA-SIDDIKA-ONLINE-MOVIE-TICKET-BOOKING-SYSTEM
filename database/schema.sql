-- ================================================================
-- Database Schema: MOHASINA SIDDIKA Online Movie Ticket Booking System
-- Database Name: mohasina_movie_db
-- Technology: MySQL 8.0+
-- Description: Full relational database schema for users, movies,
--              theaters, screens, seating layouts, showtimes,
--              bookings, reserved seats, and payment transactions.
-- ================================================================

CREATE DATABASE IF NOT EXISTS mohasina_movie_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mohasina_movie_db;

-- ----------------------------------------------------------------
-- Table 1: users
-- Description: Stores customer accounts and system administrators.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL COMMENT 'Customer or Admin full name',
    email VARCHAR(120) NOT NULL UNIQUE COMMENT 'Unique email address for authentication',
    phone_number VARCHAR(20) NULL COMMENT 'Contact phone number',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password string',
    role ENUM('customer', 'admin') DEFAULT 'customer' COMMENT 'Access control role',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account registration timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User credentials and customer profiles';

-- ----------------------------------------------------------------
-- Table 2: movies
-- Description: Stores details of movies, synopsis, ratings, and media.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL COMMENT 'Movie title',
    genre VARCHAR(100) NOT NULL COMMENT 'Comma-separated genres (e.g. Action, Sci-Fi)',
    duration_mins INT NOT NULL COMMENT 'Runtime in minutes',
    release_date DATE NOT NULL COMMENT 'Theatrical release date',
    language VARCHAR(50) DEFAULT 'English' COMMENT 'Primary audio language',
    rating DECIMAL(3, 1) DEFAULT 8.0 COMMENT 'Average rating score (0.0 to 10.0)',
    age_rating VARCHAR(10) DEFAULT 'PG-13' COMMENT 'Censor rating (e.g. G, PG, PG-13, R)',
    synopsis TEXT NOT NULL COMMENT 'Detailed plot description',
    poster_url VARCHAR(255) NOT NULL COMMENT 'Relative or absolute URL to poster image',
    banner_url VARCHAR(255) NULL COMMENT 'Wide backdrop image for banners',
    trailer_url VARCHAR(255) NULL COMMENT 'YouTube trailer embed URL',
    status ENUM('now_showing', 'coming_soon') DEFAULT 'now_showing' COMMENT 'Screening availability status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_movie_status (status),
    INDEX idx_movie_genre (genre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Catalog of screened movies';

-- ----------------------------------------------------------------
-- Table 3: theaters
-- Description: Physical cinema halls and multiplex locations.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS theaters (
    theater_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL COMMENT 'Name of cinema multiplex (e.g. Mohasina Grand Cineplex)',
    city VARCHAR(80) NOT NULL COMMENT 'City location',
    address VARCHAR(255) NOT NULL COMMENT 'Full street address',
    contact_number VARCHAR(25) NULL COMMENT 'Help desk contact telephone',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Multiplex and theater branches';

-- ----------------------------------------------------------------
-- Table 4: screens
-- Description: Auditoriums/Halls within a specific theater venue.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS screens (
    screen_id INT AUTO_INCREMENT PRIMARY KEY,
    theater_id INT NOT NULL COMMENT 'Reference to parent theater',
    screen_name VARCHAR(60) NOT NULL COMMENT 'Screen label (e.g. Screen 1 - Dolby Atmos, IMAX Screen 2)',
    total_seats INT NOT NULL DEFAULT 64 COMMENT 'Total seating capacity',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (theater_id) REFERENCES theaters(theater_id) ON DELETE CASCADE,
    INDEX idx_screen_theater (theater_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Individual screening halls';

-- ----------------------------------------------------------------
-- Table 5: seats
-- Description: Individual physical seats mapped by row and seat index.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    screen_id INT NOT NULL COMMENT 'Auditorium screen hosting the seat',
    row_label CHAR(2) NOT NULL COMMENT 'Row designation letter (e.g. A, B, C, D, E, F, G, H)',
    seat_number INT NOT NULL COMMENT 'Seat number in row (e.g. 1 through 8)',
    seat_type ENUM('standard', 'premium', 'vip') DEFAULT 'standard' COMMENT 'Category (standard, premium, vip recliner)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_screen_seat (screen_id, row_label, seat_number),
    FOREIGN KEY (screen_id) REFERENCES screens(screen_id) ON DELETE CASCADE,
    INDEX idx_seat_screen (screen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Auditorium seat blueprint';

-- ----------------------------------------------------------------
-- Table 6: showtimes
-- Description: Scheduled screening sessions for a movie at a screen.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS showtimes (
    showtime_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL COMMENT 'Screened movie',
    screen_id INT NOT NULL COMMENT 'Screen venue',
    show_date DATE NOT NULL COMMENT 'Date of the screening',
    start_time TIME NOT NULL COMMENT 'Screening start time',
    end_time TIME NULL COMMENT 'Screening conclusion time',
    base_price DECIMAL(8, 2) NOT NULL DEFAULT 250.00 COMMENT 'Base standard ticket price in local currency',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (screen_id) REFERENCES screens(screen_id) ON DELETE CASCADE,
    INDEX idx_showtime_movie_date (movie_id, show_date),
    INDEX idx_showtime_screen (screen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Movie screening schedule';

-- ----------------------------------------------------------------
-- Table 7: bookings
-- Description: Master reservation record placed by a customer.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_ref VARCHAR(30) NOT NULL UNIQUE COMMENT 'Unique customer reference (e.g. MSB-78241)',
    user_id INT NULL COMMENT 'User ID if logged in (NULL for guest checkout)',
    showtime_id INT NOT NULL COMMENT 'Target showtime session',
    customer_name VARCHAR(100) NOT NULL COMMENT 'Name of customer booking tickets',
    customer_email VARCHAR(120) NOT NULL COMMENT 'Email to deliver digital ticket',
    customer_phone VARCHAR(20) NOT NULL COMMENT 'SMS notification phone number',
    total_amount DECIMAL(10, 2) NOT NULL COMMENT 'Total cost including taxes and tier upgrades',
    booking_status ENUM('confirmed', 'cancelled', 'pending') DEFAULT 'confirmed' COMMENT 'Current booking status',
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Reservation creation timestamp',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id) ON DELETE CASCADE,
    INDEX idx_booking_ref (booking_ref),
    INDEX idx_booking_showtime (showtime_id),
    INDEX idx_booking_email (customer_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Customer ticket reservation records';

-- ----------------------------------------------------------------
-- Table 8: booking_seats
-- Description: Junction table detailing which seats belong to a booking.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS booking_seats (
    booking_seat_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL COMMENT 'Parent booking',
    seat_id INT NOT NULL COMMENT 'Reserved seat',
    price_paid DECIMAL(8, 2) NOT NULL COMMENT 'Price charged for this seat',
    UNIQUE KEY uk_booking_seat (booking_id, seat_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE CASCADE,
    INDEX idx_bseats_seat (seat_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Seats reserved per booking';

-- ----------------------------------------------------------------
-- Table 9: payments
-- Description: Financial transactions linked to bookings.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL COMMENT 'Associated booking',
    payment_method ENUM('Credit Card', 'Debit Card', 'UPI / NetBanking', 'Cash / Counter', 'Wallet') NOT NULL,
    transaction_ref VARCHAR(60) NOT NULL UNIQUE COMMENT 'Bank or gateway transaction reference',
    amount DECIMAL(10, 2) NOT NULL COMMENT 'Payment amount settled',
    payment_status ENUM('completed', 'pending', 'failed', 'refunded') DEFAULT 'completed',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    INDEX idx_payment_booking (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Transaction and payment logs';
