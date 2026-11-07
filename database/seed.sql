-- ================================================================
-- Seed Data: MOHASINA SIDDIKA Online Movie Ticket Booking System
-- Database: mohasina_movie_db
-- ================================================================

USE mohasina_movie_db;

-- 1. Insert Initial Users
INSERT INTO users (user_id, full_name, email, phone_number, password_hash, role) VALUES
(1, 'Mohasina Siddika', 'admin@mohasinacinepass.com', '+91 9876543210', '$2b$10$wKz0b9jE6vIqK0fI4J9Wre.4m5B3e2z5Y6t8r7q1u2o3p4a5s6d7f', 'admin'),
(2, 'Sarah Jenkins', 'sarah.j@example.com', '+91 9811223344', '$2b$10$wKz0b9jE6vIqK0fI4J9Wre.4m5B3e2z5Y6t8r7q1u2o3p4a5s6d7f', 'customer'),
(3, 'Rahul Sharma', 'rahul.sharma@example.com', '+91 9822334455', '$2b$10$wKz0b9jE6vIqK0fI4J9Wre.4m5B3e2z5Y6t8r7q1u2o3p4a5s6d7f', 'customer');

-- 2. Insert Theaters
INSERT INTO theaters (theater_id, name, city, address, contact_number) VALUES
(1, 'MOHASINA SIDDIKA Grand Cineplex', 'Metro City', 'Central Avenue, Promenade Mall, Level 4', '+91 (080) 4567-8900'),
(2, 'MOHASINA Luxe Cinema & IMAX', 'Metro City', 'Riverside Boulevard, Tech District', '+91 (080) 4567-8901');

-- 3. Insert Screens
INSERT INTO screens (screen_id, theater_id, screen_name, total_seats) VALUES
(1, 1, 'Auditorium 1 - Dolby Atmos 4K', 64),
(2, 1, 'IMAX Laser Hall 2', 64);

-- 4. Generate Seats for Screen 1 (8 Rows: A to H, 8 seats per row = 64 seats)
-- Rows A-D (1-8): Standard (Base price)
-- Rows E-G (1-8): Premium (+20%)
-- Row H (1-8): VIP Recliner (+50%)
INSERT INTO seats (screen_id, row_label, seat_number, seat_type) VALUES
-- Row A (Standard)
(1, 'A', 1, 'standard'), (1, 'A', 2, 'standard'), (1, 'A', 3, 'standard'), (1, 'A', 4, 'standard'),
(1, 'A', 5, 'standard'), (1, 'A', 6, 'standard'), (1, 'A', 7, 'standard'), (1, 'A', 8, 'standard'),
-- Row B (Standard)
(1, 'B', 1, 'standard'), (1, 'B', 2, 'standard'), (1, 'B', 3, 'standard'), (1, 'B', 4, 'standard'),
(1, 'B', 5, 'standard'), (1, 'B', 6, 'standard'), (1, 'B', 7, 'standard'), (1, 'B', 8, 'standard'),
-- Row C (Standard)
(1, 'C', 1, 'standard'), (1, 'C', 2, 'standard'), (1, 'C', 3, 'standard'), (1, 'C', 4, 'standard'),
(1, 'C', 5, 'standard'), (1, 'C', 6, 'standard'), (1, 'C', 7, 'standard'), (1, 'C', 8, 'standard'),
-- Row D (Standard)
(1, 'D', 1, 'standard'), (1, 'D', 2, 'standard'), (1, 'D', 3, 'standard'), (1, 'D', 4, 'standard'),
(1, 'D', 5, 'standard'), (1, 'D', 6, 'standard'), (1, 'D', 7, 'standard'), (1, 'D', 8, 'standard'),
-- Row E (Premium)
(1, 'E', 1, 'premium'), (1, 'E', 2, 'premium'), (1, 'E', 3, 'premium'), (1, 'E', 4, 'premium'),
(1, 'E', 5, 'premium'), (1, 'E', 6, 'premium'), (1, 'E', 7, 'premium'), (1, 'E', 8, 'premium'),
-- Row F (Premium)
(1, 'F', 1, 'premium'), (1, 'F', 2, 'premium'), (1, 'F', 3, 'premium'), (1, 'F', 4, 'premium'),
(1, 'F', 5, 'premium'), (1, 'F', 6, 'premium'), (1, 'F', 7, 'premium'), (1, 'F', 8, 'premium'),
-- Row G (Premium)
(1, 'G', 1, 'premium'), (1, 'G', 2, 'premium'), (1, 'G', 3, 'premium'), (1, 'G', 4, 'premium'),
(1, 'G', 5, 'premium'), (1, 'G', 6, 'premium'), (1, 'G', 7, 'premium'), (1, 'G', 8, 'premium'),
-- Row H (VIP Recliner)
(1, 'H', 1, 'vip'), (1, 'H', 2, 'vip'), (1, 'H', 3, 'vip'), (1, 'H', 4, 'vip'),
(1, 'H', 5, 'vip'), (1, 'H', 6, 'vip'), (1, 'H', 7, 'vip'), (1, 'H', 8, 'vip');

-- 5. Insert Movies Catalog (Now Showing & Coming Soon)
INSERT INTO movies (movie_id, title, genre, duration_mins, release_date, language, rating, age_rating, synopsis, poster_url, trailer_url, status) VALUES
(1, 'Interstellar: Beyond Time', 'Sci-Fi, Adventure, Drama', 169, '2024-10-15', 'English', 8.7, 'PG-13', 
 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.', 
 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80', 
 'https://www.youtube.com/embed/zSWdZVtXT7E', 'now_showing'),

(2, 'Dune: Prophecy & Destiny', 'Sci-Fi, Action, Epic', 166, '2024-11-01', 'English', 8.6, 'PG-13', 
 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between love and the universe.', 
 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80', 
 'https://www.youtube.com/embed/Way9Dexny3w', 'now_showing'),

(3, 'Spider-Verse: Across Dimensions', 'Animation, Action, Sci-Fi', 140, '2024-10-20', 'English', 8.9, 'PG', 
 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.', 
 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80', 
 'https://www.youtube.com/embed/cqGjhVJWtEg', 'now_showing'),

(4, 'Oppenheimer: The Atomic Dawn', 'Biography, Drama, History', 180, '2024-09-10', 'English', 8.9, 'R', 
 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.', 
 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80', 
 'https://www.youtube.com/embed/uYPbbksJxIg', 'now_showing'),

(5, 'The Dark Knight Legacy', 'Action, Crime, Thriller', 152, '2024-10-05', 'English', 9.0, 'PG-13', 
 'When the menace known as the Joker wreaks havoc and chaos on Gotham City, Batman must accept one of the greatest psychological and physical tests.', 
 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80', 
 'https://www.youtube.com/embed/EXeTwQWrcwY', 'now_showing'),

(6, 'Inside Out: Emotional Waves', 'Animation, Comedy, Family', 96, '2024-11-05', 'English', 8.4, 'PG', 
 'Joy, Sadness, Anger, Fear and Disgust navigate the arrival of brand new emotions including Anxiety, Envy, and Ennui during teenage years.', 
 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80', 
 'https://www.youtube.com/embed/LEjhY15eCx0', 'now_showing'),

(7, 'Avatar: Fire & Ash', 'Sci-Fi, Adventure, Fantasy', 190, '2025-12-19', 'English', 8.8, 'PG-13', 
 'Jake Sully and Neytiri travel to new biome regions of Pandora and encounter the Ash People, an aggressive clan of volcanic Na vi.', 
 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 
 'https://www.youtube.com/embed/d9MyW72ELq0', 'coming_soon'),

(8, 'Gladiator II: Rise of the Colosseum', 'Action, Drama, History', 148, '2025-11-22', 'English', 8.5, 'R', 
 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after the emperors conquer his home.', 
 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80', 
 'https://www.youtube.com/embed/4rgYUipGJNo', 'coming_soon');

-- 6. Insert Showtimes
INSERT INTO showtimes (showtime_id, movie_id, screen_id, show_date, start_time, end_time, base_price) VALUES
(1, 1, 1, CURDATE(), '10:30:00', '13:19:00', 250.00),
(2, 1, 1, CURDATE(), '14:30:00', '17:19:00', 280.00),
(3, 1, 1, CURDATE(), '18:45:00', '21:34:00', 320.00),
(4, 2, 1, CURDATE(), '13:00:00', '15:46:00', 300.00),
(5, 2, 1, CURDATE(), '19:30:00', '22:16:00', 350.00),
(6, 3, 1, CURDATE(), '11:00:00', '13:20:00', 260.00),
(7, 3, 1, CURDATE(), '16:00:00', '18:20:00', 290.00),
(8, 4, 1, CURDATE(), '20:15:00', '23:15:00', 320.00),
(9, 5, 1, CURDATE(), '15:00:00', '17:32:00', 280.00),
(10, 6, 1, CURDATE(), '12:00:00', '13:36:00', 240.00);

-- 7. Insert Sample Confirmed Bookings (Pre-booked seats for realism)
INSERT INTO bookings (booking_id, booking_ref, user_id, showtime_id, customer_name, customer_email, customer_phone, total_amount, booking_status) VALUES
(1, 'MSB-74892', 2, 1, 'Sarah Jenkins', 'sarah.j@example.com', '+91 9811223344', 500.00, 'confirmed'),
(2, 'MSB-91024', 3, 1, 'Rahul Sharma', 'rahul.sharma@example.com', '+91 9822334455', 750.00, 'confirmed');

-- 8. Insert Reserved Seats for Bookings (Seats A3, A4 for booking 1; E4, E5 for booking 2)
INSERT INTO booking_seats (booking_id, seat_id, price_paid) VALUES
(1, 3, 250.00), -- Seat A3
(1, 4, 250.00), -- Seat A4
(2, 36, 375.00), -- Seat E4
(2, 37, 375.00); -- Seat E5

-- 9. Insert Payments
INSERT INTO payments (payment_id, booking_id, payment_method, transaction_ref, amount, payment_status) VALUES
(1, 1, 'UPI / NetBanking', 'TXN-UPI-991820491', 500.00, 'completed'),
(2, 2, 'Credit Card', 'TXN-CC-882710394', 750.00, 'completed');
