const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');
const User = require('../models/User');

// Counts the nights between two dates
const countNights = (checkIn, checkOut) => {
  return Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
};

// POST /api/reservations - make a new reservation for the logged in user
const createReservation = async (req, res) => {
  try {
    // Read the booking details, accepting both the long and the short field names
    const { accommodationId } = req.body;
    const checkInDate = req.body.checkInDate || req.body.checkIn;
    const checkOutDate = req.body.checkOutDate || req.body.checkOut;
    const numberOfGuests = Number(req.body.numberOfGuests || req.body.guests);
    const totalPrice = Number(req.body.totalPrice || req.body.price);

    // Check the data before saving anything
    if (!mongoose.Types.ObjectId.isValid(accommodationId)) {
      return res.status(400).json({ message: 'A valid accommodation id is required' });
    }
    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'The dates are not valid' });
    }
    if (end <= start) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }
    if (!numberOfGuests || numberOfGuests < 1) {
      return res.status(400).json({ message: 'Please enter at least 1 guest' });
    }
    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: 'A total price is required' });
    }

    // The listing must exist and be big enough for the guests
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    if (numberOfGuests > accommodation.maxGuests) {
      return res.status(400).json({ message: `This place allows ${accommodation.maxGuests} guests at most` });
    }

    // The guest name comes from the logged in user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found, please log in again' });
    }

    const reservation = await Reservation.create({
      accommodation: accommodation._id,
      user: user._id,
      bookedBy: user.name,
      propertyName: accommodation.title,
      checkInDate: start,
      checkOutDate: end,
      totalNights: countNights(start, end),
      totalPrice,
      numberOfGuests
    });

    res.status(201).json(reservation);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error creating reservation', error: error.message });
  }
};

// GET /api/reservations - only the reservations of the logged in user
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('accommodation', 'title location images')
      .sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching reservations', error: error.message });
  }
};

// PUT /api/reservations/:id - change the dates, guests or price
const updateReservation = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid reservation id' });
    }

    // Look only inside this user's reservations
    const reservation = await Reservation.findOne({ _id: req.params.id, user: req.user.id });
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Use the new value if one was sent, otherwise keep the old one
    const start = new Date(req.body.checkInDate || reservation.checkInDate);
    const end = new Date(req.body.checkOutDate || reservation.checkOutDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'The dates are not valid' });
    }
    if (end <= start) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }

    reservation.checkInDate = start;
    reservation.checkOutDate = end;
    reservation.totalNights = countNights(start, end);
    if (req.body.numberOfGuests) reservation.numberOfGuests = Number(req.body.numberOfGuests);
    if (req.body.totalPrice) reservation.totalPrice = Number(req.body.totalPrice);

    const saved = await reservation.save();
    res.status(200).json(saved);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error updating reservation', error: error.message });
  }
};

// DELETE /api/reservations/:id - cancel one of the user's reservations
const deleteReservation = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid reservation id' });
    }

    const deleted = await Reservation.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting reservation', error: error.message });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  updateReservation,
  deleteReservation
};
