import React from 'react';

/**
 * InspirationSection Component
 * 
 * Renders 6 destination cards with bottom colored banners matching the site's locations.
 * 
 * @param {Function} onSelectLocation - Callback when a destination card is clicked.
 */
function InspirationSection({ onSelectLocation }) {
  // "value" is the exact location name used by the listings and the header dropdown
  const destinations = [
    {
      id: 'paris',
      name: 'Paris',
      value: 'Paris, France',
      country: 'France',
      bgColor: '#DE3151',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cape-town',
      name: 'Cape Town',
      value: 'Cape Town, South Africa',
      country: 'South Africa',
      bgColor: '#BC1A6E',
      image: 'https://images.unsplash.com/photo-1642964654755-56c7c3aeb5c9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      value: 'Tokyo, Japan',
      country: 'Japan',
      bgColor: '#CC2D4A',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'bali',
      name: 'Bali',
      value: 'Bali, Indonesia',
      country: 'Indonesia',
      bgColor: '#D93B30',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'montreal',
      name: 'Montreal',
      value: 'Montreal, Canada',
      country: 'Canada',
      bgColor: '#BD1E59',
      image: 'https://images.unsplash.com/photo-1470181942237-78ce33fec141?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'mauritius',
      name: 'Mauritius',
      value: 'Mauritius',
      country: 'East Africa',
      bgColor: '#E07A5F',
      image: 'https://images.unsplash.com/photo-1582574643306-d00ea3f7d49b?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleCardClick = (locationValue) => {
    if (onSelectLocation) {
      onSelectLocation(locationValue);
    }
  };

  return (
    <section style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '40px 32px 60px 32px', fontFamily: 'sans-serif' }}>
      
      {/* SECTION HEADING */}
      <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#222222', marginBottom: '24px' }}>
        Inspiration for your next trip
      </h2>

      {/* 6-CARD SINGLE ROW GRID CONTAINER */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '24px',
          width: '100%'
        }}
      >
        {destinations.map((loc) => (
          <div
            key={loc.id}
            onClick={() => handleCardClick(loc.value)}
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              height: '320px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
          >
            {/* TOP IMAGE SECTION */}
            <div style={{ flex: '1', width: '100%', overflow: 'hidden' }}>
              <img
                src={loc.image}
                alt={loc.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>

            {/* COLORFUL BOTTOM LABEL BANNER */}
            <div
              style={{
                backgroundColor: loc.bgColor,
                padding: '16px',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{loc.name}</span>
              <span style={{ fontSize: '13px', opacity: 0.9 }}>{loc.country}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default InspirationSection;
