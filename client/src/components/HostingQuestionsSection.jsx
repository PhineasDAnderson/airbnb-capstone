import React from 'react';

/**
 * HostingQuestionsSection Component
 * 
 * Displays a hero banner featuring a background image, large text overlay, 
 * and a static "Ask a Superhost" button with smooth hover effects.
 */
function HostingQuestionsSection() {
  return (
    <section 
      style={{ 
        width: '100%', 
        maxWidth: '1440px', 
        margin: '0 auto', 
        padding: '0 32px 60px 32px', 
        fontFamily: 'sans-serif' 
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '480px',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px 60px',
          boxSizing: 'border-box'
        }}
      >
        {/* BACKGROUND IMAGE WITH OVERLAY */}
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80" 
          alt="Questions about hosting" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1
          }}
        />

        {/* DARK GRADIENT OVERLAY FOR BETTER TEXT READABILITY */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 60%)',
            zIndex: 2
          }}
        />

        {/* CONTENT OVERLAY */}
        <div style={{ position: 'relative', zIndex: 3, maxWidth: '500px' }}>
          <h2 
            style={{ 
              fontSize: '64px', 
              fontWeight: '700', 
              color: '#ffffff', 
              lineHeight: '1.05', 
              margin: '0 0 40px 0',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            Questions<br />about<br />hosting?
          </h2>

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
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f7f7f7';
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            Ask a Superhost
          </button>
        </div>
      </div>
    </section>
  );
}

export default HostingQuestionsSection;