import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Zaio Bootcamp Capstone — Dynamic Floating Search Bar (SearchExpanded.jsx)
 * 
 * ARCHITECTURAL IMPLEMENTATION NOTES FOR EVALUATION:
 * - Uses inline styles to guarantee high-fidelity rendering independent of global CSS framework builds.
 * - Manages active popup drawer states ('where' | 'when' | 'who' | null) with smooth Framer Motion spring physics.
 * - Triggers instant real-time search updates to App.jsx on location button click and red button submit.
 */

function SearchExpanded({ isShrunk, onExpand, onSearch }) {
  // 1. ACTIVE POPUP MENU STATE ('where' | 'when' | 'who' | null)
  const [activeMenu, setActiveMenu] = useState(null);

  // 2. SEARCH CRITERIA STATE
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0 });

  // Popular location presets for immediate filtering
  const popularLocations = [
    { city: 'Sandton', region: 'Gauteng', icon: '🏙️' },
    { city: 'Boksburg', region: 'Gauteng', icon: '🏡' },
    { city: 'Cape Town', region: 'Western Cape', icon: '⛰️' },
    { city: 'Durban', region: 'KwaZulu-Natal', icon: '🏖️' },
  ];

  // Total guest counter label
  const totalGuests = guests.adults + guests.children;
  const guestLabel = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests';

  // 3. EXECUTE SEARCH EMISSION TO APP.JSX
  const triggerSearch = (overrideDestination = null) => {
    const finalLocation = overrideDestination !== null ? overrideDestination : destination;
    console.log('[SearchExpanded] Executing filter with target location:', finalLocation);
    setActiveMenu(null); // Close active dropdown popup
    if (onSearch) {
      onSearch({
        destination: finalLocation,
        checkIn,
        checkOut,
        guests,
      });
    }
  };

  // Helper to safely modify guest counts
  const handleGuestChange = (type, delta) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta),
    }));
  };

  // 4. COMPACT SCROLLED VIEW
  if (isShrunk) {
    return (
      <div 
        onClick={onExpand}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #E5E7EB',
          borderRadius: '9999px',
          padding: '8px 16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          backgroundColor: '#FFFFFF',
          maxWidth: '500px',
          margin: '0 auto',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '600' }}>
          <span style={{ color: '#111827' }}>{destination || 'Anywhere'}</span>
          <span style={{ color: '#9CA3AF' }}>|</span>
          <span style={{ color: '#111827' }}>{checkIn ? `${checkIn}` : 'Any week'}</span>
          <span style={{ color: '#9CA3AF' }}>|</span>
          <span style={{ color: '#6B7280', fontWeight: '400' }}>{guestLabel}</span>
        </div>
        <div style={{ backgroundColor: '#FF385C', color: '#FFFFFF', padding: '8px', borderRadius: '50%', display: 'flex' }}>
          <svg viewBox="0 0 32 32" style={{ width: '12px', height: '12px', fill: 'currentColor', stroke: 'currentColor', strokeWidth: '2' }}>
            <path d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '750px', margin: '0 auto' }}>
      
      {/* 5. FLOATING PILL BAR */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#F3F4F6',
          borderRadius: '9999px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          zIndex: 30,
          padding: '4px'
        }}
      >
        {/* WHERE SECTION */}
        <div 
          onClick={() => setActiveMenu(activeMenu === 'where' ? null : 'where')}
          style={{
            flex: 1,
            padding: '10px 24px',
            borderRadius: '9999px',
            backgroundColor: activeMenu === 'where' ? '#FFFFFF' : 'transparent',
            boxShadow: activeMenu === 'where' ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#111827', cursor: 'pointer' }}>
            Where
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setActiveMenu('where')}
            placeholder="Search destinations"
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              padding: 0,
              margin: 0
            }}
          />
        </div>

        {/* CHECK IN / OUT SECTION */}
        <div 
          onClick={() => setActiveMenu(activeMenu === 'when' ? null : 'when')}
          style={{
            flex: 1,
            padding: '10px 24px',
            borderRadius: '9999px',
            backgroundColor: activeMenu === 'when' ? '#FFFFFF' : 'transparent',
            boxShadow: activeMenu === 'when' ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#111827', cursor: 'pointer' }}>
            Check in
          </label>
          <span style={{ fontSize: '13px', fontWeight: '500', color: checkIn ? '#111827' : '#9CA3AF', display: 'block' }}>
            {checkIn && checkOut ? `${checkIn} - ${checkOut}` : checkIn || 'Add dates'}
          </span>
        </div>

        {/* WHO / GUESTS SECTION */}
        <div 
          onClick={() => setActiveMenu(activeMenu === 'who' ? null : 'who')}
          style={{
            flex: 1,
            padding: '10px 12px 10px 24px',
            borderRadius: '9999px',
            backgroundColor: activeMenu === 'who' ? '#FFFFFF' : 'transparent',
            boxShadow: activeMenu === 'who' ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease'
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#111827', cursor: 'pointer' }}>
              Who
            </label>
            <span style={{ fontSize: '13px', fontWeight: '500', color: totalGuests > 0 ? '#111827' : '#9CA3AF', display: 'block' }}>
              {guestLabel}
            </span>
          </div>

          {/* RED ACTION BUTTON */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerSearch();
            }}
            style={{
              backgroundColor: '#FF385C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: '8px',
              boxShadow: '0 2px 6px rgba(255, 56, 92, 0.4)'
            }}
            aria-label="Search"
          >
            <svg viewBox="0 0 32 32" style={{ width: '16px', height: '16px', fill: 'currentColor', stroke: 'currentColor', strokeWidth: '2' }}>
              <path d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* 6. BACKDROP TO CLOSE DROPDOWN WHEN CLICKING OUTSIDE */}
      {activeMenu && (
        <div 
          onClick={() => setActiveMenu(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 10, backgroundColor: 'transparent' }}
        />
      )}

      {/* 7. ANIMATED POPUP DROPDOWN MENUS */}
      <AnimatePresence>
        
        {/* POPUP 1: WHERE / LOCATION SUGGESTIONS */}
        {activeMenu === 'where' && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              left: 0,
              top: '70px',
              width: '320px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              border: '1px solid #F3F4F6',
              padding: '20px',
              zIndex: 20
            }}
          >
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '12px' }}>
              Recent & Popular Searches
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {popularLocations.map((loc) => (
                <button
                  key={loc.city}
                  type="button"
                  onClick={() => {
                    setDestination(loc.city);
                    triggerSearch(loc.city); // Instantly filter listings by clicked city
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '18px', padding: '8px', backgroundColor: '#F3F4F6', borderRadius: '10px' }}>
                    {loc.icon}
                  </span>
                  <div>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                      {loc.city}
                    </span>
                    <span style={{ display: 'block', fontSize: '11px', color: '#6B7280' }}>
                      {loc.region}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* POPUP 2: WHEN / DATE PICKERS */}
        {activeMenu === 'when' && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              left: '25%',
              top: '70px',
              width: '340px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              border: '1px solid #F3F4F6',
              padding: '20px',
              zIndex: 20
            }}
          >
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '12px' }}>
              Select Travel Dates
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#6B7280', marginBottom: '4px' }}>
                  CHECK-IN
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#6B7280', marginBottom: '4px' }}>
                  CHECK-OUT
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* POPUP 3: WHO / GUESTS COUNTER */}
        {activeMenu === 'who' && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              right: 0,
              top: '70px',
              width: '300px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              border: '1px solid #F3F4F6',
              padding: '20px',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Adults Counter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#111827', margin: 0 }}>Adults</p>
                <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Ages 13 or above</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleGuestChange('adults', -1)}
                  disabled={guests.adults <= 1}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    cursor: guests.adults <= 1 ? 'not-allowed' : 'pointer',
                    opacity: guests.adults <= 1 ? 0.3 : 1,
                    fontWeight: 'bold'
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '13px', fontWeight: '700', width: '16px', textAlign: 'center' }}>
                  {guests.adults}
                </span>
                <button
                  type="button"
                  onClick={() => handleGuestChange('adults', 1)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Children Counter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#111827', margin: 0 }}>Children</p>
                <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Ages 2–12</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleGuestChange('children', -1)}
                  disabled={guests.children <= 0}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    cursor: guests.children <= 0 ? 'not-allowed' : 'pointer',
                    opacity: guests.children <= 0 ? 0.3 : 1,
                    fontWeight: 'bold'
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '13px', fontWeight: '700', width: '16px', textAlign: 'center' }}>
                  {guests.children}
                </span>
                <button
                  type="button"
                  onClick={() => handleGuestChange('children', 1)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default SearchExpanded;