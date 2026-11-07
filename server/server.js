const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

// Mount API routes
app.use('/api', apiRoutes);

// Catch-all route to serve index.html for SPA feel
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Boot the application
async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log('================================================================');
    console.log(' 🎬  MOHASINA SIDDIKA Online Movie Ticket Booking System');
    console.log(` 🌐  Web Server: http://localhost:${PORT}`);
    console.log(` 📂  Frontend:   ${path.join(__dirname, '../public')}`);
    console.log(` 🔌  API:        http://localhost:${PORT}/api/movies`);
    console.log('================================================================');
  });
}

startServer();
