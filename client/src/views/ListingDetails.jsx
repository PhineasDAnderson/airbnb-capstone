import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import API from '../api';
import sampleReviews from '../data/sampleReviews';
// Styles for the calendar and for this page
import 'react-datepicker/dist/react-datepicker.css';
import './ListingDetails.css';

// The picture used for the host
const HOST_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

// The rating bars in the reviews section
// offset makes each bar a little different from the main rating
const ratingCategories = [
  { name: 'Cleanliness', offset: 0.2 },
  { name: 'Accuracy', offset: -0.1 },
  { name: 'Communication', offset: 0.1 },
  { name: 'Location', offset: 0.2 },
  { name: 'Check-in', offset: 0.1 },
  { name: 'Value', offset: -0.2 }
];

// Turns a Date into yyyy-mm-dd so the date inputs can use it
const formatDate = (date) => date.toLocaleDateString('en-CA');

// Gives back a date as yyyy-mm-dd
// n = how many days from today (0 = today, 1 = tomorrow)
const getDate = (n) => {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return formatDate(date);
};

// Turns "2026-10-18" back into a Date for the calendar (empty text gives null)
const toDate = (text) => (text ? new Date(text + 'T00:00:00') : null);

/**
 * ListingDetails
 * Shows one stay: gallery, info, "Where you'll sleep", amenities, calendar,
 * reviews, host info, house rules and the booking card with the cost calculator.
 */
function ListingDetails({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking card: dates start as today and tomorrow
  const [checkIn, setCheckIn] = useState(getDate(0));
  const [checkOut, setCheckOut] = useState(getDate(1));
  const [guestsCount, setGuestsCount] = useState(1);

  // Profile menu open or closed
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // The photo that is open in the full screen view (null means none)
  const [expandedImage, setExpandedImage] = useState(null);

  // Show all amenities or only the first few
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Show all reviews or only the first few
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Get this listing from the backend when the page opens
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await API.get(`/accommodations/${id}`);
        setListing(response.data);
      } catch (error) {
        console.error('Could not load listing:', error);
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Work out how many nights between check-in and check-out
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Cost calculator numbers
  const nights = calculateNights();
  const nightRate = listing ? listing.pricePerNight : 0;
  const stayTotal = nights * nightRate;
  // 10% off when staying a week or more
  const weeklyDiscount = nights >= 7 ? Math.round(stayTotal * 0.1) : 0;
  const cleaningFee = 50;
  const serviceFee = 50;
  const taxes = 30;
  const grandTotal = stayTotal - weeklyDiscount + cleaningFee + serviceFee + taxes;

  // Runs when the user picks dates on the calendar (first click = check-in, second = check-out)
  const handleCalendarChange = (dates) => {
    const [start, end] = dates;
    setCheckIn(start ? formatDate(start) : '');
    setCheckOut(end ? formatDate(end) : '');
  };

  // Put the dates back to today and tomorrow
  const handleClearDates = () => {
    setCheckIn(getDate(0));
    setCheckOut(getDate(1));
  };

  // Checks the booking, then saves the reservation in the database
  const handleReserve = async () => {
    // Not logged in: ask the user to log in, then bring them back to this page
    if (!user) {
      const goToLogin = window.confirm('Please log in to make a reservation. Go to the login page now?');
      if (goToLogin) {
        navigate('/login', { state: { redirectTo: `/locations/${id}` } });
      }
      return;
    }

    if (nights < 1) {
      alert('Check-out must be after check-in.');
      return;
    }

    try {
      await API.post('/reservations', {
        bookedBy: user.name,
        propertyName: listing.title,
        accommodationId: listing._id,
        userId: user._id || user.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalNights: nights,
        totalPrice: grandTotal,
        numberOfGuests: guestsCount
      });
      // The user can open "View Reservations" from the profile menu when they want to
      alert('Reservation successful!');
    } catch (error) {
      console.error('Error saving reservation:', error);
      alert('Could not save the reservation. Please try again.');
    }
  };

  // Become a host: go to admin if logged in, otherwise log in first
  const handleBecomeHostClick = () => {
    if (user) {
      navigate('/admin');
    } else {
      navigate('/login', { state: { redirectTo: '/admin' } });
    }
  };

  // Log out and go back to the home page
  const handleLogoutRedirect = () => {
    onLogout();
    navigate('/');
  };

  // Still waiting for the backend
  if (loading) {
    return (
      <div className="listing-details-container">
        <p className="loading-message">Loading property details...</p>
      </div>
    );
  }

  // Listing was not found
  if (!listing) {
    return (
      <div className="listing-details-container not-found">
        <h2>Property not found</h2>
        <Link to="/locations" className="not-found-link">
          Back to all stays
        </Link>
      </div>
    );
  }

  // The gallery: first image is big, the next four are small
  const images = listing.images || [];
  const smallImages = images.slice(1, 5);

  // Amenities: show the first 8, or all of them after the button is clicked
  const amenities = listing.amenities || [];
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 8);

  // Reviews: show the first 6, or all of them after the button is clicked
  const visibleReviews = showAllReviews ? sampleReviews : sampleReviews.slice(0, 6);

  const hostName = listing.host?.name || 'Johann';

  return (
    <div className="listing-details-container">
      {/* Header with the profile dropdown */}
      <header className="listing-details-header">
        <div className="header-content-wrapper">
          <Link to="/" className="brand-logo-link">
            <span className="brand-logo-text">airbnb</span>
          </Link>
          <nav className="header-nav-links">
            <Link to="/locations" className="nav-link active">Places to stay</Link>
            <span className="nav-link">Experiences</span>
            <span className="nav-link">Online Experiences</span>
          </nav>

          <div className="header-auth-section">
            <button type="button" onClick={handleBecomeHostClick} className="become-host-btn">
              Become a host
            </button>

            {user ? (
              <div className="profile-wrapper">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="profile-btn">
                  <span className="profile-greeting">Welcome, {user.name}</span>
                  <span className="profile-avatar">👤</span>
                </button>

                {/* Dropdown with View Reservations and Logout */}
                {showProfileMenu && (
                  <div className="profile-menu">
                    <Link
                      to="/view-reservations"
                      onClick={() => setShowProfileMenu(false)}
                      className="profile-menu-item"
                    >
                      View Reservations
                    </Link>
                    <button onClick={handleLogoutRedirect} className="profile-menu-item">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // The state tells the Login page where to send the user after they log in
              <Link to="/login" state={{ redirectTo: '/locations' }} className="auth-action-btn">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="listing-main-content">
        {/* Title, rating and location */}
        <h1 className="listing-main-title">{listing.title}</h1>

        <div className="listing-sub-header">
          <div className="rating-review-wrapper">
            <span className="star-icon">★</span>
            <span className="rating-score">{listing.rating}</span>
            <span className="review-total">({listing.reviews} reviews)</span>
          </div>
          <span className="location-separator">·</span>
          <span className="location-subtitle">{listing.location}</span>
        </div>

        {/* Image gallery: one big image and four small ones (click any to open it bigger) */}
        <div className="listing-image-grid">
          <div className="grid-main-image-wrapper">
            <img
              src={images[0]}
              alt={listing.title}
              className="grid-main-image"
              onClick={() => setExpandedImage(images[0])}
            />
          </div>
          <div className="grid-secondary-images">
            {smallImages.map((imgUrl, index) => (
              <div key={index} className="grid-sub-image-wrapper">
                <img
                  src={imgUrl}
                  alt={`${listing.title} view ${index + 2}`}
                  className="grid-sub-image"
                  onClick={() => setExpandedImage(imgUrl)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="listing-body-grid">
          <div className="listing-left-info">
            {/* Host and room info */}
            <div className="host-info-row">
              <div className="host-text-details">
                <h2>{listing.type} hosted by {hostName}</h2>
                <p>{listing.maxGuests} guests · {listing.type} · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms</p>
              </div>
              <div className="host-avatar-badge">
                <img src={HOST_AVATAR} alt="Host" className="host-avatar-img" />
              </div>
            </div>

            <hr className="section-divider" />

            {/* Static info sections (the two tick boxes only show if they were ticked) */}
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🏠</span>
                <div>
                  <h4>{listing.type}</h4>
                  <p>You'll have the place to yourself</p>
                </div>
              </div>
              {listing.enhancedCleaning && (
                <div className="feature-item">
                  <span className="feature-icon">✨</span>
                  <div>
                    <h4>Enhanced Cleaning</h4>
                    <p>This Host committed to Airbnb's 5-step enhanced cleaning process.</p>
                  </div>
                </div>
              )}
              {listing.selfCheckIn && (
                <div className="feature-item">
                  <span className="feature-icon">🔑</span>
                  <div>
                    <h4>Self Check-in</h4>
                    <p>Check yourself in with the keypad</p>
                  </div>
                </div>
              )}
              <div className="feature-item">
                <span className="feature-icon">📅</span>
                <div>
                  <h4>Free cancellation before Feb 14</h4>
                </div>
              </div>
            </div>

            <hr className="section-divider" />

            <div className="description-section">
              <p>{listing.description}</p>
            </div>

            {/* Where you'll sleep (only shows if the listing has a bedroom photo) */}
            {listing.sleepingImage && listing.sleepingImage.url && (
              <>
                <hr className="section-divider" />
                <div>
                  <h3 className="section-title">Where You'll Sleep</h3>
                  <img
                    src={listing.sleepingImage.url}
                    alt="Bedroom"
                    className="sleeping-image"
                    onClick={() => setExpandedImage(listing.sleepingImage.url)}
                  />
                  <p className="sleeping-caption">{listing.sleepingImage.caption}</p>
                  <p className="sleeping-caption">Total bedrooms: {listing.bedrooms}</p>
                </div>
              </>
            )}

            {/* What this place offers */}
            <hr className="section-divider" />
            <div>
              <h3 className="section-title">What this place offers</h3>
              <ul className="amenities-list">
                {visibleAmenities.map((amenity, index) => (
                  <li key={index} className="amenity-item">✔ {amenity}</li>
                ))}
              </ul>

              {/* Button only shows if there are more than 8 amenities */}
              {amenities.length > 8 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="outline-btn"
                >
                  {showAllAmenities ? 'Show fewer amenities' : `Show all ${amenities.length} amenities`}
                </button>
              )}
            </div>

            <hr className="section-divider" />

            {/* Calendar: pick the check-in date first, then the check-out date */}
            <div className="calendar-section">
              <h3 className="section-title">
                {nights} Night{nights === 1 ? '' : 's'} in {listing.location.split(',')[0]}
              </h3>
              <p className="calendar-dates">{checkIn} - {checkOut}</p>

              <div className="calendar-wrapper">
                <DatePicker
                  selectsRange
                  inline
                  monthsShown={2}
                  minDate={new Date()}
                  startDate={toDate(checkIn)}
                  endDate={toDate(checkOut)}
                  onChange={handleCalendarChange}
                />
              </div>

              <button onClick={handleClearDates} className="clear-dates-btn">
                Clear dates
              </button>
            </div>
          </div>

          {/* Booking card with the cost calculator */}
          <div className="listing-right-sidebar">
            <div className="booking-card">
              <div className="booking-card-header">
                <div className="price-display">
                  <span className="card-price-amount">${nightRate}</span>
                  <span className="card-price-period"> / night</span>
                </div>
                <div className="card-rating">
                  <span>★ {listing.rating}</span>
                  <span className="card-reviews">({listing.reviews})</span>
                </div>
              </div>

              <div className="booking-form-box">
                <div className="dates-grid">
                  <div className="date-input-group">
                    <label>CHECK-IN</label>
                    <input
                      type="date"
                      value={checkIn}
                      min={getDate(0)}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="date-input-group">
                    <label>CHECK-OUT</label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                <div className="guests-input-group">
                  <label>GUESTS</label>
                  <select value={guestsCount} onChange={(e) => setGuestsCount(Number(e.target.value))}>
                    {[...Array(listing.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={handleReserve} className="reserve-btn">
                Reserve
              </button>

              <p className="charge-notice">You won't be charged yet</p>

              {/* Cost breakdown, updates when the dates change */}
              <div className="price-breakdown">
                <div className="breakdown-row">
                  <span>${nightRate} x {nights} night{nights === 1 ? '' : 's'}</span>
                  <span>${stayTotal}</span>
                </div>
                <div className="breakdown-row">
                  <span>Weekly discount</span>
                  <span>-${weeklyDiscount}</span>
                </div>
                <div className="breakdown-row">
                  <span>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="breakdown-row">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="breakdown-row">
                  <span>Occupancy taxes and fees</span>
                  <span>${taxes}</span>
                </div>
              </div>

              <hr className="breakdown-divider" />

              <div className="breakdown-total">
                <span>Total</span>
                <span>${grandTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews: rating bars and a list of comments */}
        <hr className="section-divider" />
        <section className="reviews-section">
          <h3 className="section-title">★ {listing.rating} · {listing.reviews} reviews</h3>

          <div className="rating-bars">
            {ratingCategories.map((category) => {
              // Keep every score between 0 and 5
              const score = Math.min(5, listing.rating + category.offset).toFixed(1);
              return (
                <div key={category.name} className="rating-bar-row">
                  <span className="rating-bar-name">{category.name}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(score / 5) * 100}%` }}></div>
                  </div>
                  <span className="rating-bar-score">{score}</span>
                </div>
              );
            })}
          </div>

          <div className="reviews-grid">
            {visibleReviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <div className="review-avatar">{review.name[0]}</div>
                  <div>
                    <p className="review-name">{review.name}</p>
                    <p className="review-date">{review.date}</p>
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setShowAllReviews(!showAllReviews)} className="outline-btn">
            {showAllReviews ? 'Show fewer reviews' : `Show all ${sampleReviews.length} reviews`}
          </button>
        </section>

        {/* Hosted by */}
        <hr className="section-divider" />
        <section className="host-section">
          <div className="host-section-header">
            <img src={HOST_AVATAR} alt="Host" className="host-avatar-img" />
            <h3 className="section-title">Hosted By {hostName}</h3>
          </div>
          <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
          <p>Response rate: 100%</p>
          <p>Response time: within an hour</p>
          <button className="outline-btn">Contact Host</button>
          <p className="payment-note">
            🛡️ To protect your payment, never transfer money or communicate outside of the Airbnb website or app.
          </p>
        </section>

        {/* House rules, health and safety, cancellation policy */}
        <hr className="section-divider" />
        <section className="policies-grid">
          <div className="policy-column">
            <h3 className="section-title">House Rules</h3>
            <ul>
              <li>Check-in: After 4:00 PM</li>
              <li>Check-out: 10:00 AM</li>
              {listing.selfCheckIn && <li>Self check-in with lock-box</li>}
              <li>Not suitable for infants (under 2 years)</li>
              <li>No smoking</li>
              <li>No pets</li>
              <li>No parties or events</li>
            </ul>
          </div>

          <div className="policy-column">
            <h3 className="section-title">Health &amp; Safety</h3>
            <ul>
              {listing.enhancedCleaning && <li>Committed to Airbnb's enhanced cleaning process.</li>}
              <li>Airbnb's social-distancing and other COVID-19-related guidelines apply</li>
              <li>Carbon monoxide alarm</li>
              <li>Smoke alarm</li>
              <li>Security Deposit - if you damage the home, you may be charged up to $500</li>
            </ul>
          </div>

          <div className="policy-column">
            <h3 className="section-title">Cancellation Policy</h3>
            <ul>
              <li>Free cancellation before Feb 14</li>
              <li>After that, bookings can be cancelled up to 5 days before check-in for a 50% refund</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Full screen photo: click anywhere to close it */}
      {expandedImage && (
        <div className="image-modal" onClick={() => setExpandedImage(null)}>
          <span className="image-modal-close">✕</span>
          <img src={expandedImage} alt="Expanded view" className="image-modal-img" />
        </div>
      )}
    </div>
  );
}

export default ListingDetails;
