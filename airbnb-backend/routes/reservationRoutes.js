const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createReservation,
  getMyReservations,
  updateReservation,
  deleteReservation
} = require('../controllers/reservationController');

// Every reservation route needs a logged in user
router.post('/', auth, createReservation);
router.get('/', auth, getMyReservations);
router.put('/:id', auth, updateReservation);
router.delete('/:id', auth, deleteReservation);

module.exports = router;
