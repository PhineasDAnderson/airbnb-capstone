import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../api';
// Header with the search bar
import HeaderHero from '../components/HeaderHero';
// Styles for this page
import './LocationsPage.css';

/**
 * LocationsPage
 * Shows every stay from the database as a list of cards.
 * If the URL has ?location=Something, only the matching stays are shown.
 */
function LocationsPage({ onOpenAuth, user, onLogout, onSearch }) {
  // Read the ?location= value from the URL
  const [searchParams] = useSearchParams();
  const selectedLocationQuery = searchParams.get('location') || '';

  // The stays from the database, plus loading and error messages
  const [locationsData, setLocationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get all the stays from the backend when the page opens
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await API.get('/accommodations');
        setLocationsData(response.data);
      } catch (err) {
        console.error('Could not load stays:', err);
        setError('Could not load the stays. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Makes text lowercase and removes commas so "Paris, France" matches "Paris France"
  const normalize = (text) => (text ? text.toLowerCase().replace(/,/g, '').trim() : '');

  // Keep only the stays that match the chosen location (or all of them by default)
  const filteredLocations =
    selectedLocationQuery && selectedLocationQuery !== 'All Locations'
      ? locationsData.filter((item) => {
          const place = normalize(item.location);
          const query = normalize(selectedLocationQuery);
          return place.includes(query) || query.includes(place);
        })
      : locationsData;

  // Heading text, e.g. "1 stay in Mauritius" or "6 stays in all locations"
  const headingText =
    selectedLocationQuery && selectedLocationQuery !== 'All Locations'
      ? `${filteredLocations.length} stay${filteredLocations.length === 1 ? '' : 's'} in ${selectedLocationQuery}`
      : `${filteredLocations.length} stays in all locations`;

  return (
    <div className="locations-page-container">
      {/* Header without the big hero banner */}
      <HeaderHero
        showHeroBanner={false}
        onOpenAuth={onOpenAuth}
        user={user}
        onLogout={onLogout}
        onSearch={onSearch}
      />

      <main className="locations-content-wrapper">
        {/* Loading message while we wait for the backend */}
        {loading && (
          <p style={{ textAlign: 'center', paddingTop: '120px', color: '#717171' }}>
            Loading stays...
          </p>
        )}

        {/* Error message if the backend did not answer */}
        {!loading && error && (
          <p style={{ textAlign: 'center', paddingTop: '120px', color: '#b91c1c' }}>
            {error}
          </p>
        )}

        {/* The list of stays */}
        {!loading && !error && (
          <>
            <h1 className="locations-heading">{headingText}</h1>

            <div className="locations-list">
              {filteredLocations.map((item) => (
                <Link
                  to={`/locations/${item._id}`}
                  key={item._id}
                  className="location-card-link-wrapper"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div className="location-card">
                    {/* Photo on the left (first image of the listing) */}
                    <div className="location-card-image-wrapper">
                      <img
                        src={item.images && item.images[0]}
                        alt={item.title}
                        className="location-card-image"
                      />
                    </div>

                    {/* Details on the right */}
                    <div className="location-card-details">
                      <span className="location-type">{item.type}</span>
                      <h2 className="location-title">{item.title}</h2>

                      <p className="location-specs">
                        {item.maxGuests} guests · {item.type} · {item.bedrooms} bedrooms · {item.bathrooms} bathrooms
                      </p>

                      <p className="location-amenities">
                        {item.amenities && item.amenities.slice(0, 4).join(' - ')}
                      </p>

                      {/* Rating on the left, price on the right */}
                      <div className="location-card-footer">
                        <div className="location-rating">
                          <span className="star-icon">★</span>
                          <span className="rating-value">{item.rating}</span>
                          <span className="reviews-count">({item.reviews} reviews)</span>
                        </div>

                        <div className="location-price">
                          <span className="price-amount">${item.pricePerNight}</span>
                          <span className="price-period"> / night</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default LocationsPage;
