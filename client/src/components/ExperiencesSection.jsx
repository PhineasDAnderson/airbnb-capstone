import React from 'react';

/**
 * ExperiencesSection Component
 * 
 * Displays 2 static feature cards for "Things to do on your trip" and "Things to do from home"
 * with interactive hover effects on the cards and CTA buttons.
 */
function ExperiencesSection() {
  const experiences = [
    {
      id: 'trip-experiences',
      title: 'Things to do\non your trip',
      buttonText: 'Experiences',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'online-experiences',
      title: 'Things to do\nfrom home',
      buttonText: 'Online Experiences',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
    }
  ];

  return (
    <section style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '40px 32px 60px 32px', fontFamily: 'sans-serif' }}>
      
      {/* SECTION HEADING */}
      <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#222222', marginBottom: '24px', tracking: '-0.02em' }}>
        Discover Airbnb Experiences
      </h2>

      {/* 2-CARD GRID CONTAINER */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          width: '100%'
        }}
      >
        {experiences.map((exp) => (
          <div
            key={exp.id}
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              height: '480px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.18)';
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transform = 'scale(1)';
            }}
          >
            {/* BACKGROUND IMAGE WITH SMOOTH SCALE ZOOM */}
            <img
              src={exp.image}
              alt={exp.title.replace('\n', ' ')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.5s ease'
              }}
            />

            {/* CARD CONTENT OVERLAY */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: '48px 40px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'flex-start',
                alignItems: 'flex-start',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 60%)'
              }}
            >
              {/* HEADING */}
              <h3 
                style={{ 
                  fontSize: '42px', 
                  fontWeight: '700', 
                  color: '#ffffff', 
                  lineHeight: '1.15',
                  whiteSpace: 'pre-line',
                  marginBottom: '28px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {exp.title}
              </h3>

              {/* STATIC BUTTON WITH HOVER EFFECT */}
              <button
                type="button"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#222222',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  e.currentTarget.style.backgroundColor = '#f7f7f7';
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                }}
              >
                {exp.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExperiencesSection;