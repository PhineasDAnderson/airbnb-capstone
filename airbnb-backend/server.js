const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load the .env file first so everything below can use it
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const accommodationRoutes = require('./routes/accommodationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Stop right away if the secret for the login tokens is missing
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing in the .env file');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// Read JSON from requests and only allow our own frontend to call the API
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

// Simple route to check that the server is running
app.get('/', (req, res) => {
  res.send('Airbnb Capstone Backend API is running...');
});

// All the API routes
app.use('/api/auth', authRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/reservations', reservationRoutes);

// Any other URL gets a 404 message
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server when it runs on my own computer
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app so the hosting service can run it
module.exports = app;