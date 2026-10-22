// Vehicle Card Component
// Displays vehicle details: model, type, pricePerDay, available
// Shows "Book Now" button if available, or "Not Available" badge
import React from 'react';

const VehicleCard = ({ model, type, pricePerDay, available, onBook }) => {
  const cardStyle = {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '180px'
  };

  const badgeStyle = {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    textAlign: 'center'
  };

  const buttonStyle = {
    padding: '8px 12px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  return (
    <div style={cardStyle}>
      <div>
        <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>{model}</h3>
        <p style={{ margin: '4px 0', color: '#64748b' }}>Type: <strong>{type}</strong></p>
        <p style={{ margin: '4px 0', color: '#16a34a', fontSize: '18px', fontWeight: 'bold' }}>
          ${pricePerDay} / day
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px', color: available ? '#15803d' : '#b91c1c' }}>
          Status: <strong>{available ? 'Available' : 'Unavailable'}</strong>
        </p>
      </div>

      <div style={{ marginTop: '12px' }}>
        {available ? (
          <button onClick={onBook} style={buttonStyle}>
            Book Now
          </button>
        ) : (
          <span style={badgeStyle}>Not Available</span>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
