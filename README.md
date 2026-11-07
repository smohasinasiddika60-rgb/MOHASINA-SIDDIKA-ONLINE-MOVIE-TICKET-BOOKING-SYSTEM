# MOHASINA SIDDIKA Online Movie Ticket Booking System

A modern, full-stack Online Movie Ticket Booking web platform developed with **HTML5, CSS3, JavaScript (ES6+), Express.js (Node.js)**, and **MySQL 8.0**.

Designed with a **professional, light, and attractive aesthetic** featuring warm amber and gold cinema accents, real-time interactive theater seat selection (Standard, Premium, and VIP Recliner), instant printable digital ticket passes with QR codes, and a dual-mode database engine.

---

## 🌟 Project Overview

* **Project Title**: MOHASINA SIDDIKA Online Movie Ticket Booking System
* **Host / Curator Branding**: MOHASINA SIDDIKA
* **Hero Image**: Prominently features the custom cinema auditorium portrait of Mohasina Siddika holding movie tickets on the front page.
* **Architecture**: Client-Server REST Architecture (SPA Frontend + Express.js API + MySQL Relational Database).
* **Dual-Mode Engine**: Includes automatic fallback to an in-memory/JSON data store pre-seeded with all movies, seats, and showtimes so the platform runs immediately without requiring a running MySQL server.

---

## 📂 Project Folder Structure

```
mohasina-movie-booking/
│
├── database/
│   ├── schema.sql              # MySQL DDL table definition script (7 normalized tables)
│   ├── seed.sql                # Pre-populated movies, auditoriums, seats & bookings
│   └── data-dictionary.md      # Detailed database tables and field names documentation
│
├── public/
│   ├── index.html              # Frontend single-page layout (Hero, Catalog, Seat Booking, Ticket)
│   ├── css/
│   │   └── styles.css          # Modern light & attractive stylesheet (warm amber/coral/ivory)
│   ├── js/
│   │   ├── app.js              # Client state, REST API client, modals & lookup portal
│   │   └── seat-picker.js      # Dynamic curved screen & interactive seat picker engine
│   └── assets/
│       └── images/
│           ├── mohasina-hero.jpg # Hero image of Mohasina Siddika holding cinema tickets
│           └── posters/        # Film catalog media
│
├── server/
│   ├── config/
│   │   └── db.js               # MySQL2 pool connector with smart in-memory fallback
│   ├── controllers/
│   │   ├── movieController.js  # Movie catalog & showtime controllers
│   │   └── bookingController.js# Reservation & seat allocation controllers
│   ├── routes/
│   │   └── api.js              # Express REST routing endpoints
│   └── server.js               # Application entrypoint & static file server
│
├── .env                        # Local environment variables
├── .env.example                # Environment variables template
├── package.json                # Project dependencies and run scripts
└── README.md                   # Full documentation & setup guide
```

---

## 🗄️ Database Tables & Field Names

The relational database (`mohasina_movie_db`) contains 7 core tables:

### 1. `users`
* `user_id` (INT, PK, AUTO_INCREMENT) - Unique customer identifier
* `full_name` (VARCHAR(100)) - Customer's full name
* `email` (VARCHAR(120), UNIQUE) - User email address
* `phone_number` (VARCHAR(20)) - Contact telephone number
* `password_hash` (VARCHAR(255)) - Salting & hashed credentials
* `role` (ENUM('customer', 'admin')) - User role
* `created_at` (TIMESTAMP) - Account creation date

### 2. `movies`
* `movie_id` (INT, PK, AUTO_INCREMENT) - Unique movie identifier
* `title` (VARCHAR(150)) - Title of the film
* `genre` (VARCHAR(100)) - Film genres (e.g., Sci-Fi, Action)
* `duration_mins` (INT) - Runtime in minutes
* `release_date` (DATE) - Theatrical release date
* `language` (VARCHAR(50)) - Dialogue language
* `rating` (DECIMAL(3,1)) - Score out of 10.0
* `age_rating` (VARCHAR(10)) - Certification (PG-13, R, PG)
* `synopsis` (TEXT) - Detailed plot summary
* `poster_url` (VARCHAR(255)) - Poster image link
* `trailer_url` (VARCHAR(255)) - YouTube trailer embed
* `status` (ENUM('now_showing', 'coming_soon')) - Release status

### 3. `theaters` & `screens`
* **`theaters`**: `theater_id` (PK), `name`, `city`, `address`, `contact_number`
* **`screens`**: `screen_id` (PK), `theater_id` (FK), `screen_name`, `total_seats`

### 4. `seats`
* `seat_id` (INT, PK, AUTO_INCREMENT) - Unique seat ID
* `screen_id` (INT, FK) - Target auditorium screen
* `row_label` (CHAR(2)) - Row designation ('A' through 'H')
* `seat_number` (INT) - Seat number in row (1 to 8)
* `seat_type` (ENUM('standard', 'premium', 'vip')) - Seating tier

### 5. `showtimes`
* `showtime_id` (INT, PK, AUTO_INCREMENT) - Screening session ID
* `movie_id` (INT, FK) - Associated movie
* `screen_id` (INT, FK) - Auditorium hall
* `show_date` (DATE) - Show screening date
* `start_time` (TIME) - Showtime start time
* `base_price` (DECIMAL(8,2)) - Standard ticket base price

### 6. `bookings` & `booking_seats`
* **`bookings`**: `booking_id` (PK), `booking_ref` (VARCHAR, UNIQUE e.g. `MSB-74892`), `user_id` (FK), `showtime_id` (FK), `customer_name`, `customer_email`, `customer_phone`, `total_amount`, `booking_status`, `booking_time`
* **`booking_seats`**: `booking_seat_id` (PK), `booking_id` (FK), `seat_id` (FK), `price_paid`

### 7. `payments`
* `payment_id` (PK), `booking_id` (FK), `payment_method`, `transaction_ref`, `amount`, `payment_status`, `payment_date`

*(For full field-level specifications, see `database/data-dictionary.md`)*

---

## 🚀 Quick Start & Installation

### Step 1: Open Terminal & Navigate to Project
```bash
cd /Users/vmdzakeer/.gemini/antigravity/scratch/mohasina-movie-booking
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Web Server
```bash
npm start
```
The server will start at: **`http://localhost:3000`**

---

## 🛢️ Connecting to MySQL (Optional)

If you have MySQL installed and wish to link a live MySQL server:

1. Log in to your MySQL server:
   ```bash
   mysql -u root -p
   ```
2. Execute the schema and seed scripts:
   ```sql
   SOURCE database/schema.sql;
   SOURCE database/seed.sql;
   ```
3. Update your `.env` file:
   ```ini
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=mohasina_movie_db
   DB_PORT=3306
   ```
4. Restart the server:
   ```bash
   npm start
   ```
   *Note: If MySQL is not running, the application automatically runs in High-Fidelity In-Memory mode without crashing.*

---

## 🎟️ Key Features
1. **Prominent Hero Banner**: Mohasina Siddika's portrait holding cinema tickets with popcorn and cinema lighting.
2. **Interactive Theater Layout**: Realistic curved screen with Dolby Atmos styling, 3 seat tiers (Standard ₹250, Premium +20%, VIP Recliner +50%), dynamic pricing calculation, and booked seat locks.
3. **Printable Ticket Stub**: Generates a realistic cinema ticket receipt complete with booking reference, seat numbers, show details, and QR verification.
4. **Self-Service Ticket Lookup**: Search and display bookings by reference code (`MSB-74892`, `MSB-91024`).
5. **Modern Light Aesthetic**: Warm ivory, golden honey, and coral palette with glassmorphism cards and smooth animations.
