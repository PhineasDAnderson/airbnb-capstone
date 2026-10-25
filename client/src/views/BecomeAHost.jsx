import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * BecomeAHost
 * Onboarding page where a host types their address and clicks "Get started".
 * The header is added in App.jsx, so this file only holds the page content.
 * Uses inline styles (not Tailwind) so it looks the same everywhere.
 */
function BecomeAHost() {
  // The address typed into the box
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Checks the address is not empty, then opens the host dashboard
  const handleStartHosting = (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please enter your address to get started.');
      return;
    }
    setError('');
    navigate('/admin');
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 40px 60px 40px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '48px',
        fontFamily: 'sans-serif',
        color: '#222222',
        boxSizing: 'border-box'
      }}
    >
      {/* Left side: heading and address form */}
      <div style={{ flex: 1, minWidth: '300px' }}>
        <h1 style={{ fontSize: '44px', fontWeight: '800', lineHeight: 1.15, margin: '0 0 16px 0' }}>
          Set up your<br />Airbnb listing
        </h1>
        <p style={{ fontSize: '16px', color: '#717171', margin: '0 0 28px 0' }}>
          It's easy to create a great listing—let's start with your address.
        </p>

        <form onSubmit={handleStartHosting} style={{ maxWidth: '420px' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <svg
              viewBox="0 0 24 24"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', stroke: '#717171', strokeWidth: '2', fill: 'none' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px 14px 42px', border: '1px solid #b0b0b0', borderRadius: '30px', fontSize: '14px', outline: 'none' }}
            />
          </div>

          {/* Red message if the address box is empty */}
          {error && (
            <p style={{ color: '#b91c1c', fontSize: '13px', margin: '0 0 12px 0' }}>⚠️ {error}</p>
          )}

          <button
            type="submit"
            style={{ width: '100%', padding: '14px', backgroundColor: '#ff385c', color: '#ffffff', border: 'none', borderRadius: '30px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
          >
            Get started
          </button>
        </form>

        <p style={{ fontSize: '13px', color: '#717171', marginTop: '20px' }}>
          Not listing a home? Host an <span style={{ textDecoration: 'underline', fontWeight: '600' }}>experience or service</span>.
        </p>
      </div>

      {/* Right side: picture */}
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"
          alt="Airbnb property"
          style={{ width: '100%', maxWidth: '520px', height: '450px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }}
        />
      </div>
    </div>
  );
}

export default BecomeAHost;
