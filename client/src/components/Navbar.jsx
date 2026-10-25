import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout, onSearch }) {
  const navigate = useNavigate();

  // Simple state to open and close the user profile dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handles logging out the user and returning to the home page
  const handleLogoutClick = () => {
    onLogout();
    setDropdownOpen(false); // Close dropdown menu
    navigate('/');
  };

  // Checks if user is logged in before opening the Admin Dashboard
  const handleBecomeHostClick = (e) => {
    e.preventDefault();
    setDropdownOpen(false); // Close dropdown menu

    if (user) {
      // If logged in, go straight to the Admin Dashboard
      navigate('/admin');
    } else {
      // If logged out, go to login page and remember to redirect back to admin after
      navigate('/login', { state: { redirectTo: '/admin' } });
    }
  };

  return (
    <header className="w-full bg-black text-white py-4 px-6 md:px-12 flex items-center justify-between z-50 relative">
      
      {/* Brand logo - clicking it goes back home */}
      <Link to="/" className="flex items-center gap-2 text-white no-underline">
        <svg className="w-8 h-8 text-rose-500 fill-current" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span className="text-xl font-bold tracking-tight text-white">
          airbnb
        </span>
      </Link>

      {/* Search input bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="flex items-center justify-between bg-white rounded-full py-1.5 px-4 shadow-md text-sm">
          <input
            type="text"
            placeholder="Search destinations"
            className="bg-transparent border-none outline-none w-full text-sm text-gray-800"
            onChange={(e) => {
              if (onSearch) {
                onSearch({ destination: e.target.value });
              }
            }}
          />
          <button 
            type="button" 
            className="bg-rose-500 text-white p-2 rounded-full ml-2 cursor-pointer border-none flex-shrink-0 flex items-center justify-center"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation action buttons */}
      <div className="flex items-center gap-4 text-white relative">
        <button
          type="button"
          onClick={handleBecomeHostClick}
          className="text-sm font-semibold hover:opacity-80 transition no-underline text-white bg-transparent border-none cursor-pointer hidden md:inline-block"
        >
          Become a host
        </button>
        
        {/* Profile menu toggle button */}
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center justify-center p-2 gap-2 rounded-full bg-gray-800 hover:bg-gray-700 border-none text-white cursor-pointer transition relative"
        >
          <svg className="w-4 h-4 stroke-current stroke-2 ml-1" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg className="w-5 h-5 fill-none stroke-current stroke-2 mr-1" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        {/* Profile dropdown popup menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-12 w-48 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 py-2 z-50 text-left">
            {user ? (
              /* Options for logged in users */
              <>
                <div className="px-4 py-1.5 text-xs border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  Hi, {user.name || 'Guest'}
                </div>
                <Link 
                  to="/view-reservations" 
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 no-underline font-medium"
                >
                  My Reservations
                </Link>
                <button
                  type="button"
                  onClick={handleBecomeHostClick}
                  className="w-full text-left block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 no-underline font-medium md:hidden bg-transparent border-none cursor-pointer"
                >
                  Become a host
                </button>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="w-full text-left block px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-semibold border-none bg-transparent cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              /* Options for guests / logged out users */
              <>
                <button
  type="button"
  onClick={() => {
    setDropdownOpen(false);
    localStorage.setItem('postLoginRedirect', '/locations');
    navigate('/login');
  }}
  className="w-full text-left block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 font-semibold border-none bg-transparent cursor-pointer"
>
  Login
</button>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-left block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 font-medium border-none bg-transparent cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;