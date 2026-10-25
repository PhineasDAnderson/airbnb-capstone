import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HeaderHero from './components/HeaderHero';
import AdminHeader from './components/AdminHeader';
import Footer from './components/Footer';
import AdminDashboard from './views/AdminDashboard';
import Login from './views/Login';
import ListingDetails from './views/ListingDetails';
import BecomeAHost from './views/BecomeAHost';
import InspirationSection from './components/InspirationSection';
import ExperiencesSection from './components/ExperiencesSection';
import GiftCardsSection from './components/GiftCardsSection';
import HostingQuestionsSection from './components/HostingQuestionsSection';
import ViewReservations from './pages/ViewReservations';
import LocationsPage from './pages/LocationsPage';

import './App.css';
import './index.css';

function App() {
  const location = useLocation();

  // The details page gets a shorter footer, and the host pages have no footer
  const isDetailsPage = location.pathname.startsWith('/locations/') && location.pathname !== '/locations';
  const isHostPage = location.pathname === '/admin' || location.pathname === '/host';
  const hideFooter = isHostPage;

  // Load the saved user from local storage right away, so a page refresh keeps the user logged in
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (err) {
      console.error('Failed to read the saved user:', err);
      return null;
    }
  });

  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: null,
    checkOut: null,
    guests: { adults: 1, children: 0, infants: 0, pets: 0 },
  });

  const handleSearch = (searchData) => {
    setSearchParams(searchData);
  };

  // Clear session data from storage and reset user state on logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* MAIN CONTENT ROUTING CONTAINER */}
      <main style={{ width: '100%', flexGrow: 1, position: 'relative' }}>
        <Routes>

          {/* 1. ROOT HOME PAGE ROUTE */}
          <Route
            path="/"
            element={
              <div className="home-page-container">
                <HeaderHero
                  user={user}
                  onLogout={handleLogout}
                  onSearch={handleSearch}
                />
                <InspirationSection
                  onSelectLocation={(locationName) => handleSearch({ destination: locationName })}
                />
                <ExperiencesSection />
                <GiftCardsSection />
                <HostingQuestionsSection />
              </div>
            }
          />

          {/* 2. ALL LOCATIONS BROWSE ROUTE */}
          <Route
            path="/locations"
            element={
              <LocationsPage
                user={user}
                onLogout={handleLogout}
                onSearch={handleSearch}
              />
            }
          />

          {/* 3. SINGLE LISTING DETAILS ROUTE */}
          <Route
            path="/locations/:id"
            element={
              <ListingDetails
                user={user}
                onLogout={handleLogout}
              />
            }
          />

          {/* 4. BECOME A HOST ROUTE (needs login, uses the admin header) */}
          <Route
            path="/host"
            element={
              user ? (
                <>
                  <AdminHeader user={user} onLogout={handleLogout} />
                  <BecomeAHost />
                </>
              ) : (
                <Navigate to="/login" replace state={{ redirectTo: '/host' }} />
              )
            }
          />

          {/* 5. ADMIN DASHBOARD ROUTE (needs login, uses the admin header) */}
          <Route
            path="/admin"
            element={
              user ? (
                <>
                  <AdminHeader user={user} onLogout={handleLogout} />
                  <AdminDashboard user={user} />
                </>
              ) : (
                <Navigate to="/login" replace state={{ redirectTo: '/admin' }} />
              )
            }
          />

          {/* 6. LOGIN DEDICATED VIEW ROUTE */}
          <Route
            path="/login"
            element={
              <Login
                setUser={(userData) => {
                  setUser(userData);
                  localStorage.setItem('user', JSON.stringify(userData));
                }}
              />
            }
          />

          {/* 7. VIEW RESERVATIONS ROUTE */}
          <Route path="/view-reservations" element={<ViewReservations />} />
        </Routes>
      </main>

      {/* GLOBAL FOOTER (the getaways tabs are left out on the details page, hidden on the host pages) */}
      {!hideFooter && <Footer showGetaways={!isDetailsPage} />}
    </div>
  );
}

export default App;
