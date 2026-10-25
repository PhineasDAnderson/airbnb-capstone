// Import mongoose to build the schema
const mongoose = require('mongoose');

// Accommodation schema: one property listing that people can book
const accommodationSchema = new mongoose.Schema(
  {
    // Title of the listing
    title: {
      type: String,
      required: [true, 'Please provide a listing title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    // Description of the stay
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    // Where the property is, e.g. "Paris, France"
    location: {
      type: String,
      required: [true, 'Please provide a property location'],
      trim: true
    },
    // Optional address
    address: {
      type: String
    },
    // Price for one night (used by the cost calculator)
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide a nightly price'],
      min: [0, 'Price must be a positive number']
    },
    // Image links for the gallery (first one is the big picture)
    images: [String],
    // Photo and caption for the "Where you'll sleep" section
    sleepingImage: {
      url: String,
      caption: String
    },
    // Things like wifi, kitchen, pool
    amenities: [String],
    // Most guests allowed
    maxGuests: {
      type: Number,
      required: [true, 'Please specify maximum guest limit'],
      default: 2
    },
    // Number of bedrooms
    bedrooms: {
      type: Number,
      required: [true, 'Please specify bedroom count'],
      default: 1
    },
    // Kind of place, e.g. "Entire home"
    type: {
      type: String,
      required: [true, 'Please choose a listing type']
    },
    // Number of bathrooms
    bathrooms: {
      type: Number,
      default: 1
    },
    // The two tick boxes from the admin form
    enhancedCleaning: {
      type: Boolean,
      default: false
    },
    selfCheckIn: {
      type: Boolean,
      default: false
    },
    // Review score from 1 to 5
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0']
    },
    // How many reviews the listing has
    reviews: {
      type: Number,
      default: 0
    },
    // The user who owns the listing
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Export the model
module.exports = mongoose.model('Accommodation', accommodationSchema);
