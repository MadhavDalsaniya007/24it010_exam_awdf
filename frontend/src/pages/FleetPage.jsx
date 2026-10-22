// Fleet Page Component
// Displays vehicle fleet, filter by vehicle type, and booking form
import React, { useState, useEffect } from 'react';
import VehicleCard from '../components/VehicleCard';
import { useAuth } from '../context/AuthContext';

const FleetPage = () => {
  const { token } = useAuth();

  // State management
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state (All | Hatchback | Sedan | SUV)
  const [filterType, setFilterType] = useState('All');

  // Booking form states
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch vehicles from API on component mount
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/v1/vehicles');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vehicles');
      }
      setVehicles(data.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load fleet. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filter vehicles locally in memory without triggering a new API call
  const filteredVehicles = filterType === 'All'
    ? vehicles
    : vehicles.filter((v) => v.type === filterType);

  // Submit booking request
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    setBookingMessage(null);
    setBookingLoading(true);

    try {
      const response = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId: selectedVehicle._id,
          pickupDate,
          returnDate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete booking');
      }

      setBookingMessage({
        type: 'success',
        text: `Success! Vehicle ${selectedVehicle.model} booked successfully.`
      });

      // Clear selection and refresh vehicle availability
      setSelectedVehicle(null);
      setPickupDate('');
      setReturnDate('');
      fetchVehicles();
    } catch (err) {
      setBookingMessage({
        type: 'error',
        text: err.message
      });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h2>Available Vehicle Fleet</h2>

      {/* Type Filter Controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
        <strong>Filter by Type:</strong>
        {['All', 'Hatchback', 'Sedan', 'SUV'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              backgroundColor: filterType === type ? '#2563eb' : '#f1f5f9',
              color: filterType === type ? '#ffffff' : '#334155',
              cursor: 'pointer',
              fontWeight: filterType === type ? 'bold' : 'normal'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Booking Form (Visible when vehicle is selected or for booking messages) */}
      <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Booking Section</h3>

        {bookingMessage && (
          <div
            style={{
              padding: '10px',
              marginBottom: '12px',
              borderRadius: '4px',
              backgroundColor: bookingMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: bookingMessage.type === 'success' ? '#15803d' : '#b91c1c'
            }}
          >
            {bookingMessage.text}
          </div>
        )}

        {selectedVehicle ? (
          <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Selected Vehicle:</label>
              <strong>{selectedVehicle.model} ({selectedVehicle.type}) - ${selectedVehicle.pricePerDay}/day</strong>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Pickup Date:</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Return Date:</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: bookingLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {bookingLoading ? 'Confirming...' : 'Confirm Reservation'}
            </button>

            <button
              type="button"
              onClick={() => setSelectedVehicle(null)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#94a3b8',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel Selection
            </button>
          </form>
        ) : (
          <p style={{ margin: 0, color: '#64748b' }}>
            Click "Book Now" on any available vehicle below to reserve it.
          </p>
        )}
      </div>

      {/* Fleet Display: Loading / Friendly Error / Grid */}
      {loading ? (
        <p style={{ fontSize: '16px', color: '#64748b' }}>Loading...</p>
      ) : error ? (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px' }}>
          {error}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <p>No vehicles found for the selected type.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px'
          }}
        >
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              model={vehicle.model}
              type={vehicle.type}
              pricePerDay={vehicle.pricePerDay}
              available={vehicle.available}
              onBook={() => {
                setSelectedVehicle(vehicle);
                setBookingMessage(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FleetPage;
