import React from 'react';

/**
 * GiftCardsSection Component
 * 
 * Displays a Call to Action block with a heading, static "Learn more" button with hover effect,
 * and decorative Airbnb gift card images styled on the right (each displaying the Airbnb logo).
 */
function GiftCardsSection() {
  // Reusable Airbnb Logo Component
  const AirbnbLogo = ({ size = 32 }) => (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="#ffffff">
      <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.008-3.09 7.806-7.5 7.806-2.528 0-4.811-1.233-6.505-3.351C13.811 30.767 11.528 32 9 32 4.59 32 1.5 28.202 1.5 24.194c0-.924.243-1.805.91-3.396l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C11.472 2.222 12.927 1.259 14.935 1.01L16 1zm0 3c-1.054 0-1.884.606-2.88 2.502l-.504.97c-1.883 3.69-5.926 12.169-6.84 14.305l-.117.284c-.53 1.265-.722 1.886-.755 2.531l-.004.202c0 2.68 2.003 5.206 4.9 5.206 1.88 0 3.642-.99 5.09-2.8l.21-.268.21.268c1.448 1.81 3.21 2.8 5.09 2.8 2.897 0 4.9-2.526 4.9-5.206 0-.645-.192-1.266-.722-2.531l-.117-.284c-.914-2.136-4.957-10.615-6.84-14.305l-.504-.97C17.884 4.606 17.054 4 16 4zm0 13a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
    </svg>
  );

  return (
    <section 
      style={{ 
        width: '100%', 
        maxWidth: '1440px', 
        margin: '0 auto', 
        padding: '60px 32px 80px 32px', 
        fontFamily: 'sans-serif' 
      }}
    >
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '40px'
        }}
      >
        {/* LEFT COLUMN: TEXT & BUTTON */}
        <div style={{ flex: '1', maxWidth: '420px' }}>
          <h2 
            style={{ 
              fontSize: '40px', 
              fontWeight: '700', 
              color: '#222222', 
              lineHeight: '1.15', 
              marginBottom: '24px',
              letterSpacing: '-0.02em'
            }}
          >
            Shop Airbnb<br />gift cards
          </h2>

          {/* STATIC BUTTON WITH HOVER EFFECT */}
          <button
            type="button"
            style={{
              backgroundColor: '#222222',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 24px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#222222';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Learn more
          </button>
        </div>

        {/* RIGHT COLUMN: GIFT CARDS DISPLAY */}
        <div 
          style={{ 
            flex: '1', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'relative',
            minHeight: '260px'
          }}
        >
          {/* CARD 1 (Left Tilt with Image + Airbnb Logo Overlay) */}
          <div
            style={{
              width: '210px',
              height: '135px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              transform: 'rotate(-12deg) translateY(-10px)',
              marginRight: '-30px',
              zIndex: 2,
              position: 'relative',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(-10deg) translateY(-16px) scale(1.04)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-12deg) translateY(-10px)'}
          >
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" 
              alt="Airbnb Gift Card Beach" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.15)'
            }}>
              <AirbnbLogo size={36} />
            </div>
          </div>

          {/* CARD 2 (Center Red Accent with Airbnb Logo) */}
          <div
            style={{
              width: '210px',
              height: '135px',
              borderRadius: '12px',
              backgroundColor: '#FF385C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 24px rgba(255, 56, 92, 0.3)',
              transform: 'rotate(5deg) translateY(10px)',
              zIndex: 3,
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(3deg) translateY(4px) scale(1.04)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(5deg) translateY(10px)'}
          >
            <AirbnbLogo size={44} />
          </div>

          {/* CARD 3 (Right Tilt with Image + Airbnb Logo Overlay) */}
          <div
            style={{
              width: '210px',
              height: '135px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              transform: 'rotate(15deg) translateY(-5deg)',
              marginLeft: '-30px',
              zIndex: 1,
              position: 'relative',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(12deg) translateY(-10px) scale(1.04)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(15deg) translateY(-5deg)'}
          >
            <img 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" 
              alt="Airbnb Gift Card House" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.15)'
            }}>
              <AirbnbLogo size={36} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GiftCardsSection;