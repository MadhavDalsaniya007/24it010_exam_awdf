// My Bookings Page Component
// Displays customer's personal bookings with option to cancel
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const MyBookingsPage = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  // Fetch logged-in customer's bookings
  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/v1/bookings/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
      setBookings(data.data || []);
    } catch (err) {
      setError(err.message || 'Could not load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // Cancel booking by calling PATCH /api/v1/bookings/:id/status
  const handleCancelBooking = async (bookingId) => {
    try {
      setActionMessage(null);
      const response = await fetch(`/api/v1/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel booking');
      }

      setActionMessage({ type: 'success', text: 'Booking was successfully cancelled.' });
      // Refresh bookings
      fetchMyBookings();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reserved': return '#d97706';
      case 'ongoing': return '#2563eb';
      case 'completed': return '#16a34a';
      case 'cancelled': return '#dc2626';
      default: return '#64748b';
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h2>My Bookings</h2>

      {actionMessage && (
        <div
          style={{
            padding: '10px',
            marginBottom: '16px',
            borderRadius: '4px',
            backgroundColor: actionMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: actionMessage.type === 'success' ? '#15803d' : '#b91c1c'
          }}
        >
          {actionMessage.text}
        </div>
      )}

      {loading ? (
        <p style={{ fontSize: '16px', color: '#64748b' }}>Loading...</p>
      ) : error ? (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px' }}>
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <p style={{ color: '#64748b' }}>You have not made any bookings yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 4px 0' }}>
                  {booking.vehicleId ? `${booking.vehicleId.model} (${booking.vehicleId.type})` : 'Vehicle info unavailable'}
                </h4>
                <div style={{ fontSize: '14px', color: '#475569' }}>
                  <span>Pickup: <strong>{new Date(booking.pickupDate).toLocaleDateString()}</strong></span>
                  {'  |  '}
                  <span>Return: <strong>{new Date(booking.returnDate).toLocaleDateString()}</strong></span>
                </div>
                <div style={{ marginTop: '6px', fontSize: '13px' }}>
                  Status:{' '}
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: getStatusColor(booking.status),
                      textTransform: 'uppercase'
                    }}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              {booking.status === 'reserved' && (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
