const mongoose = require('mongoose');

// A reservation links a user to an accommodation for some dates
const reservationSchema = new mongoose.Schema(
  {
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accommodation',
      required: [true, 'Reservation must belong to an accommodation']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reservation must belong to a user']
    },
    // Saved as text so the reservations table can show them easily
    bookedBy: {
      type: String,
      required: [true, 'Guest name is required']
    },
    propertyName: {
      type: String,
      required: [true, 'Property name is required']
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please specify a check-in date']
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please specify a check-out date']
    },
    totalNights: {
      type: Number,
      required: true,
      min: [1, 'A stay must be at least 1 night']
    },
    // The total from the cost calculator
    totalPrice: {
      type: Number,
      required: [true, 'Reservation must contain a total price'],
      min: [0, 'Price cannot be negative']
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Please specify number of guests'],
      min: [1, 'At least 1 guest is needed']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
