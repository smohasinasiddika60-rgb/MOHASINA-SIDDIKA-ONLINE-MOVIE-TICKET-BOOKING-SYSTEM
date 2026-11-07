# Data Dictionary - MOHASINA SIDDIKA Online Movie Ticket Booking System

**Database Name**: `mohasina_movie_db`  
**Database Management System**: MySQL 8.0+  
**Architecture**: 3NF Normalized Relational Schema

---

## 1. Table: `users`
Stores user profile information, authentication credentials, and access roles (Customer, Admin).

| Column Name | Data Type | Key | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `user_id` | `INT` | PK | NO | AUTO_INCREMENT | Unique identifier for each registered user |
| `full_name` | `VARCHAR(100)` | - | NO | - | Full legal or display name of the customer/admin |
| `email` | `VARCHAR(120)` | UK | NO | - | Unique email address utilized for login and ticket alerts |
| `phone_number` | `VARCHAR(20)` | - | YES | NULL | Customer contact telephone number |
| `password_hash` | `VARCHAR(255)` | - | NO | - | Securely salted and hashed password (e.g. bcrypt) |
| `role` | `ENUM('customer','admin')` | - | NO | `'customer'` | User permission role determining system access level |
| `created_at` | `TIMESTAMP` | - | NO | `CURRENT_TIMESTAMP` | System timestamp when account was registered |
| `updated_at` | `TIMESTAMP` | - | NO | `CURRENT_TIMESTAMP ON UPDATE` | Last modification timestamp |

---

## 2. Table: `movies`
Stores movies currently screening or scheduled for upcoming release, including promotional metadata.

| Column Name | Data Type | Key | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `movie_id` | `INT` | PK | NO | AUTO_INCREMENT | Unique identifier for each movie title |
| `title` | `VARCHAR(150)` | - | NO | - | Title of the motion picture |
| `genre` | `VARCHAR(100)` | - | NO | - | Comma-delimited list of genres (e.g. Action, Sci-Fi) |
| `duration_mins` | `INT` | - | NO | - | Movie duration in minutes |
| `release_date` | `DATE` | - | NO | - | Theatrical release or premiere date |
| `language` | `VARCHAR(50)` | - | NO | `'English'` | Primary dialogue and audio language |
| `rating` | `DECIMAL(3,1)` | - | YES | `8.0` | Audience/critic aggregated score (0.0 to 10.0) |
| `age_rating` | `VARCHAR(10)` | - | YES | `'PG-13'` | Film board certification rating (PG, PG-13, R) |
| `synopsis` | `TEXT` | - | NO | - | Full narrative summary of the film plot |
| `poster_url` | `VARCHAR(255)` | - | NO | - | Relative path or web URL for the movie poster graphic |
| `banner_url` | `VARCHAR(255)` | - | YES | NULL | High-resolution wide banner backdrop image |
| `trailer_url` | `VARCHAR(255)` | - | YES | NULL | YouTube / video embed URL for trailer preview |
| `status` | `ENUM('now_showing','coming_soon')`| - | NO | `'now_showing'` | Current theatrical release status |
| `created_at` | `TIMESTAMP` | - | NO | `CURRENT_TIMESTAMP` | Record creation timestamp |

---

## 3. Table: `theaters`
Defines cinema complexes and physical multiplex locations.

| Column Name | Data Type | Key | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `theater_id` | `INT` | PK | NO | AUTO_INCREMENT | Unique cinema complex identifier |
| `name` | `VARCHAR(120)` | - | NO | - | Name of theater complex (e.g. MOHASINA Grand Cineplex) |
| `city` | `VARCHAR(80)` | - | NO | - | City in which the cinema is situated |
| `address` | `VARCHAR(255)` | - | NO | - | Physical street address of the building |
| `contact_number`| `VARCHAR(25)` | - | YES | NULL | Helpdesk contact telephone |
| `created_at` | `TIMESTAMP` | - | NO | `CURRENT_TIMESTAMP` | Venue creation timestamp |

---

## 4. Table: `screens`
Defines individual auditoriums and projection halls within each theater.

| Column Name | Data Type | Key | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `screen_id` | `INT` | PK | NO | AUTO_INCREMENT | Unique auditorium screen identifier |
| `theater_id` | `INT` | FK | NO | - | References `theaters(theater_id)` (ON DELETE CASCADE) |
| `screen_name` | `VARCHAR(60)` | - | NO | - | Auditorium name (e.g. Screen 1 - Dolby Atmos 4K) |
| `total_seats` | `INT` | - | NO | `64` | Total seating capacity of the screen |
| `created_at` | `TIMESTAMP` | - | NO | `CURRENT_TIMESTAMP` | Screen registration timestamp |

---

## 5. Table: `seats`
Maintains individual seat coordinates and classification tiers for each auditorium.

| Column Name | Data Type | Key | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `seat_id` | `INT` | PK | NO | AUTO_INCREMENT | Unique physical seat identifier |
| `screen_id` | `INT` | FK | NO | - | References `screens(screen_id)` (ON DELETE CASCADE) |
| `row_label` | `CHAR(2)` | - | NO | - | Row letter designation (e.g. 'A', 'B', 'C', ..., 'H') |
| `seat_number`| `INT` | - | NO | - | Horizontal seat index within row (1 to 8) |
| `seat_type` | `ENUM('standard','premium','vip')` | - | NO | `'standard'` | Tier determining seat price multiplier |
| `created_at` | `TIMESTAMP` | - | NO | `CURRENT_TIMESTAMP` | Record timestamp |

* **Unique Constraint**: `uk_screen_seat (screen_id, row_label, seat_number)` ensures no duplicate seat coordinates.

---

## 6. Table: `showtimes`
Maps movies to specific screens, dates, and screening time slots.

| Column Name | Data Type | Key | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `showtime_id` | `INT` | PK | NO | AUTO_INCREMENT | Unique screening session identifier |
| `movie_id` | `INT` | FK | NO | - | References `movies(movie_id)` (ON DELETE CASCADE) |
| `screen_id` | `INT` | FK | NO | - | References `screens(screen_id)` (ON DELETE CASCADE) |
| `show_date` | `DATE` | - | NO | - | Date of the movie screening |
| `start_time` | `TIME` | - | NO | - | Start time of the movie |
| `end_time` | `TIME` | - | YES | NULL | Expected end time of screening |
| `base_price` | `DECIMAL(8,2)` | - | NO | `250.00` | Standard base seat price in local currency |
| `created_at` | `TIMESTAMP` | - | NO | `CURRENT_TIMESTAMP` | Showtime creation timestamp |

---

## 7. Table: `bookings`
Master ticket reservation records initiated by customers.

| Column Name | Data Type | Key | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `booking_id` | `INT` | PK | NO | AUTO_INCREMENT | Unique internal reservation identifier |
| `booking_ref` | `VARCHAR(30)` | UK | NO | - | Customer-facing reference code (e.g. `MSB-74892`) |
| `user_id` | `INT` | FK | YES | NULL | References `users(user_id)` (NULL for guest checkout) |
| `showtime_id` | `INT` | FK | NO | - | References `showtimes(showtime_id)` (ON DELETE CASCADE) |
| `customer_name`| `VARCHAR(100)`| - | NO | - | Full name of the ticket purchaser |
| `customer_email`| `VARCHAR(120)`| - | NO | - | Email address to receive the digital ticket pass |
| `customer_phone`| `VARCHAR(20)` | - | NO | - | Mobile number for SMS booking confirmations |
| `total_amount` | `DECIMAL(10,2)`| - | NO | - | Total billing amount including seat tier charges |
| `booking_status`| `ENUM('confirmed','cancelled','pending')` | - | NO | `'confirmed'` | Current state of reservation |
| `booking_time` | `TIMESTAMP` | - | NO | `CURRENT_TIMESTAMP` | Exact timestamp when order was placed |

---

## 8. Table: `booking_seats`
Associative junction table linking individual auditorium seats to a booking.

| Column Name | Data Type | Key | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `booking_seat_id` | `INT` | PK | NO | AUTO_INCREMENT | Unique identifier for booked seat row |
| `booking_id` | `INT` | FK | NO | - | References `bookings(booking_id)` (ON DELETE CASCADE) |
| `seat_id` | `INT` | FK | NO | - | References `seats(seat_id)` (ON DELETE CASCADE) |
| `price_paid` | `DECIMAL(8,2)` | - | NO | - | Final amount billed for this particular seat |

* **Unique Constraint**: `uk_booking_seat (booking_id, seat_id)` prevents assigning the same seat multiple times to one booking.

---

## 9. Table: `payments`
Stores billing records, gateway confirmation codes, and payment settlement states.

| Column Name | Data Type | Key | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `payment_id` | `INT` | PK | NO | AUTO_INCREMENT | Unique transaction identifier |
| `booking_id` | `INT` | FK | NO | - | References `bookings(booking_id)` (ON DELETE CASCADE) |
| `payment_method` | `ENUM('Credit Card','Debit Card','UPI / NetBanking','Cash / Counter','Wallet')` | - | NO | - | Channel utilized to complete payment |
| `transaction_ref`| `VARCHAR(60)` | UK | NO | - | External bank or merchant reference number |
| `amount` | `DECIMAL(10,2)`| - | NO | - | Settled monetary transaction value |
| `payment_status` | `ENUM('completed','pending','failed','refunded')` | - | NO | `'completed'` | Status of financial settlement |
| `payment_date` | `TIMESTAMP` | - | NO | `CURRENT_TIMESTAMP` | Date and time when payment was processed |
