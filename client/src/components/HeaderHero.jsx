import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logoImg from '../assets/Airbnb-Logo.png';
import './HeaderHero.css';

function HeaderHero({ onOpenAuth, user, onLogout, onSearch, showHeroBanner = true }) {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const locationFromUrl = searchParams.get('location') || '';

  // Simple state variables for tracking page actions and inputs
  const [isScrolled, setIsScrolled] = useState(false);
  // An empty value means "All Locations" (no location in the URL)
  const [selectedLocation, setSelectedLocation] = useState(locationFromUrl);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  
  const [adultsCount, setAdultsCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);

  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const totalGuests = adultsCount + childrenCount;

  // Keep location in sync with the URL
  useEffect(() => {
    setSelectedLocation(locationFromUrl);
  }, [locationFromUrl]);

  // Shrink header slightly when scrolling down the page
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    // Choosing "All Locations" clears the filter, so the stored value goes back to empty
    setSelectedLocation(value === 'All Locations' ? '' : value);

    if (value === 'All Locations' || value === '') {
      navigate('/locations');
    } else {
      navigate(`/locations?location=${encodeURIComponent(value)}`);
    }

    if (onSearch) {
      onSearch({
        destination: value === 'All Locations' ? '' : value,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: totalGuests,
        adults: adultsCount,
        children: childrenCount
      });
    }
  };

  const handleDateChange = (field, value) => {
    if (field === 'checkIn') setCheckInDate(value);
    if (field === 'checkOut') setCheckOutDate(value);

    if (onSearch) {
      onSearch({
        destination: selectedLocation === 'All Locations' ? '' : selectedLocation,
        checkIn: field === 'checkIn' ? value : checkInDate,
        checkOut: field === 'checkOut' ? value : checkOutDate,
        guests: totalGuests,
        adults: adultsCount,
        children: childrenCount
      });
    }
  };

  const handleAdultsChange = (delta) => {
    const newCount = Math.max(0, adultsCount + delta);
    setAdultsCount(newCount);
    const newTotal = newCount + childrenCount;

    if (onSearch) {
      onSearch({
        destination: selectedLocation === 'All Locations' ? '' : selectedLocation,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: newTotal,
        adults: newCount,
        children: childrenCount
      });
    }
  };

  const handleChildrenChange = (delta) => {
    const newCount = Math.max(0, childrenCount + delta);
    setChildrenCount(newCount);
    const newTotal = adultsCount + newCount;

    if (onSearch) {
      onSearch({
        destination: selectedLocation === 'All Locations' ? '' : selectedLocation,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: newTotal,
        adults: adultsCount,
        children: newCount
      });
    }
  };

  const handleSearchSubmit = () => {
    if (selectedLocation === 'All Locations' || selectedLocation === '') {
      navigate('/locations');
    } else {
      navigate(`/locations?location=${encodeURIComponent(selectedLocation)}`);
    }

    if (onSearch) {
      onSearch({
        destination: selectedLocation === 'All Locations' ? '' : selectedLocation,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: totalGuests,
        adults: adultsCount,
        children: childrenCount
      });
    }
  };

  // Protected route handler for Become a host -> routes directly to /admin dashboard
  const handleBecomeHostClick = () => {
    if (user) {
      navigate('/admin');
    } else {
      navigate('/login', { state: { redirectTo: '/admin' } });
    }
  };

  return (
    <div className="hero-section">
      
      {/* Main sticky navigation header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          width: '100%',
          backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.8)' : 'none'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: isScrolled ? '10px 40px 6px 40px' : '18px 40px 10px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Logo takes user back to home */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flex: '1' }}>
            <img 
              src={logoImg} 
              alt="Airbnb Logo" 
              style={{ 
                height: '80px', 
                width: 'auto', 
                objectFit: 'contain',
                mixBlendMode: 'screen',
                transition: 'all 0.3s ease' 
              }} 
            />
          </Link>

          {/* Navigation links in the middle */}
          <div style={{
            display: isScrolled ? 'none' : 'flex',
            justifyContent: 'center',
            gap: '32px',
            fontSize: '15px',
            fontWeight: '500',
            flex: '2'
          }}>
            <span style={{ color: '#ffffff', cursor: 'pointer', borderBottom: '2px solid #ffffff', paddingBottom: '4px', whiteSpace: 'nowrap' }}>
              Places to stay
            </span>
            <span style={{ color: '#b0b0b0', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Experiences
            </span>
            <span style={{ color: '#b0b0b0', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Online Experiences
            </span>

          </div>

          {/* Right side: Host button and user profile dropdown menu */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px', flex: '1', position: 'relative' }}>
            <button 
              type="button"
              onClick={handleBecomeHostClick}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#ffffff', 
                fontSize: isScrolled ? '13px' : '14px', 
                fontWeight: '500', 
                whiteSpace: 'nowrap', 
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit'
              }}
            >
              Become a host
            </button>

            {/* Profile button to open/close menu */}
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '30px',
                padding: isScrolled ? '4px 4px 4px 10px' : '6px 6px 6px 12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <svg viewBox="0 0 32 32" style={{ width: '16px', height: '16px', fill: 'none', stroke: '#222222', strokeWidth: '3' }}>
                <path d="M2 16h28M2 8h28M2 24h28" />
              </svg>
              <div style={{ width: isScrolled ? '24px' : '30px', height: isScrolled ? '24px' : '30px', backgroundColor: '#717171', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                <svg viewBox="0 0 32 32" style={{ width: '14px', height: '14px', fill: '#ffffff' }}>
                  <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.308-3.23 7.806-7.5 7.806-2.88 0-5.32-1.571-6.736-3.882L16 27.674l-.264.344C14.32 30.329 11.88 31.9 9 31.9c-4.27 0-7.5-3.498-7.5-7.806 0-1.255.335-2.428.971-3.711l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C11.537 1.963 12.992 1 16 1z" />
                </svg>
              </div>
            </button>

            {/* Dropdown popup menu for login/logout and viewing reservations */}
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '55px',
                right: '0',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                width: '200px',
                padding: '8px 0',
                zIndex: 1000,
                color: '#222222',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {user ? (
                  <>
                    <Link 
                      to="/view-reservations" 
                      onClick={() => setShowUserMenu(false)}
                      style={{ padding: '12px 16px', textDecoration: 'none', color: '#222222', fontSize: '14px', fontWeight: '500' }}
                    >
                      My Reservations
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      style={{
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#222222',
                        fontWeight: '500',
                        width: '100%'
                      }}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      localStorage.setItem('postLoginRedirect', window.location.pathname);
                      navigate('/login');
                    }}
                    style={{
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#222222',
                      fontWeight: 'bold',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    Log in / Sign up
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search bar container */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: isScrolled ? '4px 20px 10px 20px' : '8px 20px 20px 20px',
          transition: 'padding 0.3s ease'
        }}>
          <div style={{
            position: 'relative',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '40px',
            display: 'flex',
            alignItems: 'center',
            maxWidth: isScrolled ? '650px' : '900px',
            width: '100%',
            padding: isScrolled ? '4px 6px 4px 16px' : '8px 10px 8px 24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            color: '#222222'
          }}>
            
            {/* Location dropdown. The values match the locations of the listings. */}
            <div style={{ flex: '1.4', borderRight: '1px solid #e5e7eb', paddingRight: '12px' }}>
              <div style={{ fontSize: isScrolled ? '10px' : '11px', fontWeight: 'bold', color: '#222222' }}>Locations</div>
              <select
                value={selectedLocation}
                onChange={handleLocationChange}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: isScrolled ? '12px' : '13px',
                  color: '#222222',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                {/* The hidden option is what shows by default. The real "All Locations" option below can be clicked. */}
                <option value="" hidden>All Locations</option>
                <option value="All Locations">All Locations</option>
                <option value="Paris, France">Paris, France</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Cape Town, South Africa">Cape Town, South Africa</option>
                <option value="Bali, Indonesia">Bali, Indonesia</option>
                <option value="Montreal, Canada">Montreal, Canada</option>
                <option value="Tokyo, Japan">Tokyo, Japan</option>
              </select>
            </div>

            {/* Check-in input */}
            <div style={{ flex: '1.2', borderRight: '1px solid #e5e7eb', paddingLeft: '12px', paddingRight: '12px' }}>
              <div style={{ fontSize: isScrolled ? '10px' : '11px', fontWeight: 'bold', color: '#222222' }}>Check in</div>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => handleDateChange('checkIn', e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: isScrolled ? '11px' : '12px',
                  color: checkInDate ? '#222222' : '#717171',
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit',
                  cursor: 'text'
                }}
              />
            </div>

            {/* Check-out input */}
            <div style={{ flex: '1.2', borderRight: '1px solid #e5e7eb', paddingLeft: '12px', paddingRight: '12px' }}>
              <div style={{ fontSize: isScrolled ? '10px' : '11px', fontWeight: 'bold', color: '#222222' }}>Check out</div>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => handleDateChange('checkOut', e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: isScrolled ? '11px' : '12px',
                  color: checkOutDate ? '#222222' : '#717171',
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit',
                  cursor: 'text'
                }}
              />
            </div>

            {/* Guests selector and counter popover */}
            <div 
              style={{ flex: '1.2', paddingLeft: '12px', cursor: 'pointer', position: 'relative' }}
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
            >
              <div style={{ fontSize: isScrolled ? '10px' : '11px', fontWeight: 'bold', color: '#222222' }}>Guests</div>
              <div style={{ fontSize: isScrolled ? '12px' : '13px', color: totalGuests > 0 ? '#222222' : '#717171' }}>
                {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}
              </div>

              {showGuestDropdown && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  style={{
                    position: 'absolute',
                    top: '125%',
                    right: 0,
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    minWidth: '260px',
                    color: '#222222',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Adults</div>
                      <div style={{ fontSize: '12px', color: '#717171' }}>Ages 13 or above</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleAdultsChange(-1)}
                        disabled={adultsCount <= 0}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1px solid #b0b0b0',
                          backgroundColor: '#ffffff',
                          cursor: adultsCount <= 0 ? 'not-allowed' : 'pointer',
                          opacity: adultsCount <= 0 ? 0.4 : 1,
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '18px', textAlign: 'center' }}>
                        {adultsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdultsChange(1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1px solid #b0b0b0',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Children</div>
                      <div style={{ fontSize: '12px', color: '#717171' }}>Ages 0–12</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleChildrenChange(-1)}
                        disabled={childrenCount <= 0}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1px solid #b0b0b0',
                          backgroundColor: '#ffffff',
                          cursor: childrenCount <= 0 ? 'not-allowed' : 'pointer',
                          opacity: childrenCount <= 0 ? 0.4 : 1,
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '18px', textAlign: 'center' }}>
                        {childrenCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleChildrenChange(1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1px solid #b0b0b0',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search button */}
            <button
              type="button"
              onClick={handleSearchSubmit}
              style={{
                backgroundColor: '#ff385c',
                border: 'none',
                borderRadius: '50%',
                width: isScrolled ? '36px' : '48px',
                height: isScrolled ? '36px' : '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.3s ease'
              }}
            >
              <svg viewBox="0 0 32 32" style={{ width: isScrolled ? '13px' : '16px', height: isScrolled ? '13px' : '16px', fill: '#ffffff', stroke: '#ffffff', strokeWidth: '2' }}>
                <path d="M13 0c7.18 0 13 5.82 13 13 0 2.868-.929 5.519-2.502 7.669l7.916 7.916-2.828 2.828-7.916-7.916A12.94 12.94 0 0113 26C5.82 26 0 20.18 0 13S5.82 0 13 0zm0 4a9 9 0 100 18 9 9 0 000-18z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer div to prevent content from hiding under the fixed header */}
      <div style={{ height: isScrolled ? '130px' : '180px', transition: 'height 0.3s ease' }} />

      {/* Hero banner section */}
      {showHeroBanner && (
        <div className="hero-banner-wrapper">
          <div className="hero-banner">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
              alt="Airbnb Hero"
              className="hero-banner-img"
            />
            <div className="hero-banner-text">
              <p>Not sure where to go? Perfect.</p>
              <button type="button" className="hero-flexible-btn" onClick={() => navigate('/locations')}>
                I'm flexible
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderHero;
