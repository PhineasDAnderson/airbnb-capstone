import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api'; 

function ViewReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reservations from the database when the page loads
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await API.get('/reservations');
        setReservations(response.data);
      } catch (err) {
        console.error('Error fetching reservations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  // Delete a reservation by its ID
  const handleDelete = async (id) => {
    try {
      await API.delete(`/reservations/${id}`);
      setReservations(reservations.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting reservation:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '150px' }}>
        <p style={{ fontSize: '16px', color: '#717171', fontWeight: '500' }}>Loading reservations...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '28px', fontWeight: '700', color: '#222222' }}>
        My Reservations
      </h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f7f7f7', borderBottom: '1px solid #dddddd', textAlign: 'left' }}>
            <th style={{ padding: '16px', fontWeight: '600', fontSize: '14px', color: '#222222' }}>Booked by</th>
            <th style={{ padding: '16px', fontWeight: '600', fontSize: '14px', color: '#222222' }}>Property name</th>
            <th style={{ padding: '16px', fontWeight: '600', fontSize: '14px', color: '#222222' }}>Check-in Date</th>
            <th style={{ padding: '16px', fontWeight: '600', fontSize: '14px', color: '#222222' }}>Check-out Date</th>
            <th style={{ padding: '16px', fontWeight: '600', fontSize: '14px', color: '#222222' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((item) => {
            // Clean up the date string for display
            const checkInFormatted = item.checkInDate ? item.checkInDate.toString().split('T')[0] : item.checkIn;
            const checkOutFormatted = item.checkOutDate ? item.checkOutDate.toString().split('T')[0] : item.checkOut;
            
            const guestName = item.user?.name || item.bookedBy || 'User';
            const propertyTitle = item.accommodation?.title || item.propertyName || 'Property';

            return (
              <tr key={item._id} style={{ borderBottom: '1px solid #eeeeee' }}>
                <td style={{ padding: '16px', color: '#222222', fontSize: '14px', fontWeight: '500' }}>{guestName}</td>
                <td style={{ padding: '16px', color: '#222222', fontSize: '14px' }}>{propertyTitle}</td>
                <td style={{ padding: '16px', color: '#717171', fontSize: '14px' }}>{checkInFormatted}</td>
                <td style={{ padding: '16px', color: '#717171', fontSize: '14px' }}>{checkOutFormatted}</td>
                <td style={{ padding: '16px' }}>
                  <button 
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    style={{ background: '#FF385C', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}

          {reservations.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#717171', fontSize: '14px' }}>
                No reservations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link to="/" style={{ color: '#FF385C', textDecoration: 'underline', fontWeight: '600', fontSize: '14px' }}>
          Back to all stays
        </Link>
      </div>
    </div>
  );
}

export default ViewReservations;