/**
 * Accommodation Routes Module
 * Configures RESTful API endpoints for property listings. Delegates request 
 * processing to accommodationController and enforces JWT authentication on write operations.
 */

const express = require('express');
const router = express.Router();

// Imports JWT authentication middleware to restrict modification endpoints
const auth = require('../middleware/auth');

// Imports controller handlers to keep routing architecture clean and modular
const {
  getAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation
} = require('../controllers/accommodationController');

/**
 * @route   GET /api/accommodations
 * @desc    Fetch all accommodation listings
 * @access  Public
 */
// Maps GET requests to retrieve all listings for public browsing views
router.get('/', getAccommodations);

/**
 * @route   GET /api/accommodations/:id
 * @desc    Fetch a single accommodation listing by ID
 * @access  Public
 */
// Maps GET requests with URL parameters to supply property profile details to UpdateListing and Detail views
router.get('/:id', getAccommodationById);

/**
 * @route   POST /api/accommodations
 * @desc    Create a new accommodation listing
 * @access  Private (Requires valid JWT Bearer token)
 */
// Protects resource creation by executing auth middleware before handing off to the creation controller
router.post('/', auth, createAccommodation);

/**
 * @route   PUT /api/accommodations/:id
 * @desc    Update an existing accommodation listing by ID
 * @access  Private (Requires valid JWT Bearer token)
 */
// Intercepts modification payloads to update database documents matching the specified ID parameter
router.put('/:id', auth, updateAccommodation);

/**
 * @route   DELETE /api/accommodations/:id
 * @desc    Delete an accommodation listing by ID
 * @access  Private (Requires valid JWT Bearer token)
 */
// Protects deletion routes so only authorized accounts can purge listing records
router.delete('/:id', auth, deleteAccommodation);

module.exports = router;