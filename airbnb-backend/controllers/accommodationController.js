const mongoose = require('mongoose');
const Accommodation = require('../models/Accommodation');

// Only these fields can be saved from the request body
const allowedFields = [
  'title',
  'description',
  'location',
  'address',
  'pricePerNight',
  'images',
  'sleepingImage',
  'amenities',
  'maxGuests',
  'bedrooms',
  'type',
  'bathrooms',
  'enhancedCleaning',
  'selfCheckIn',
  'rating',
  'reviews',
];

// Copies only the allowed fields from the request body into a new object
const pickAllowedFields = (body) => {
  const data = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });
  return data;
};

// Gets the logged in user's id that the auth middleware saved on the request
const getUserId = (req) => {
  return req.user.id || req.user._id;
};

// Get all listings (public)
const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find({});
    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({ message: 'Could not get listings', error: error.message });
  }
};

// Get one listing by id (public)
const getAccommodationById = async (req, res) => {
  try {
    // Stop early if the id is not a real MongoDB id
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid listing id' });
    }

    // Find the listing and fill in the host's name
    const accommodation = await Accommodation.findById(req.params.id).populate('host', 'name');

    if (!accommodation) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: 'Could not get the listing', error: error.message });
  }
};

// Create a listing (logged in users only)
const createAccommodation = async (req, res) => {
  try {
    // Take only the allowed fields and set the host to the logged in user
    const data = pickAllowedFields(req.body);
    data.host = getUserId(req);

    const accommodation = await Accommodation.create(data);
    res.status(201).json(accommodation);
  } catch (error) {
    // Mongoose validation problems are the user's mistake, so send 400
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Could not create the listing', error: error.message });
  }
};

// Update a listing (only the host can do this)
const updateAccommodation = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid listing id' });
    }

    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Only the host of this listing may change it
    if (accommodation.host.toString() !== getUserId(req).toString()) {
      return res.status(403).json({ message: 'You can only update your own listings' });
    }

    // Update the allowed fields and save so the validation runs
    const data = pickAllowedFields(req.body);
    accommodation.set(data);
    const updated = await accommodation.save();

    res.status(200).json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Could not update the listing', error: error.message });
  }
};

// Delete a listing (only the host can do this)
const deleteAccommodation = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid listing id' });
    }

    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Only the host of this listing may delete it
    if (accommodation.host.toString() !== getUserId(req).toString()) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    await accommodation.deleteOne();
    res.status(200).json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete the listing', error: error.message });
  }
};

module.exports = {
  getAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
};