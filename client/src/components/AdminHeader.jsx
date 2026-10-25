import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * AdminHeader
 * Header for the host pages (/admin and /host).
 * Shows the logo, "Welcome, name" and a profile button with a dropdown menu.
 */
function AdminHeader({ user, onLogout }) {
  const navigate = useNavigate();

  // Opens and closes the dropdown menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown when the user clicks anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewReservations = () => {
    setMenuOpen(false);
    navigate('/view-reservations');
  };

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
    navigate('/');
  };

  // Style shared by both dropdown items
  const menuItemStyle = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#222222',
    fontFamily: 'inherit'
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        backgroundColor: '#ffffff',
        fontFamily: 'sans-serif'
      }}
    >
      {/* Logo: clicking it goes to the home page */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
        <svg viewBox="0 0 32 32" style={{ width: '32px', height: '32px', fill: 'none', stroke: '#ff385c', strokeWidth: '2.2', strokeLinejoin: 'round' }}>
          <path d="M16 3C18 3 19 5 20 7L27 22C29 27 25 30 21 29C19 28.5 17.5 27 16 25C14.5 27 13 28.5 11 29C7 30 3 27 5 22L12 7C13 5 14 3 16 3Z" />
          <path d="M16 25C13 21 12.5 18.5 13.5 17C14.3 15.8 17.7 15.8 18.5 17C19.5 18.5 19 21 16 25Z" />
        </svg>
        <span style={{ color: '#ff385c', fontSize: '24px', fontWeight: 'bold' }}>airbnb</span>
      </Link>

      {/* Right side: greeting and profile button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px', color: '#222222' }}>
          Welcome, {user?.name || 'Host'}
        </span>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 10px 8px 14px',
              backgroundColor: '#ffffff',
              border: '1px solid #dddddd',
              borderRadius: '30px',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
            }}
          >
            {/* Menu (hamburger) icon */}
            <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', stroke: '#222222', strokeWidth: '2', fill: 'none' }}>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            {/* Profile icon */}
            <span style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#717171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', stroke: '#ffffff', strokeWidth: '2', fill: 'none' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '54px',
                width: '190px',
                backgroundColor: '#ffffff',
                border: '1px solid #dddddd',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                padding: '8px 0',
                zIndex: 1000
              }}
            >
              <button type="button" onClick={handleViewReservations} style={menuItemStyle}>
                View Reservations
              </button>
              <button type="button" onClick={handleLogout} style={menuItemStyle}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
