// Admin Panel Component
// Lazy loaded for performance and role-based fleet management overview
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { customer, token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('/api/v1/vehicles');
        const data = await res.json();
        setVehicles(data.data || []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.available).length;
  const bookedVehicles = totalVehicles - availableVehicles;

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h2>Admin & Fleet Management Panel</h2>
      <p style={{ color: '#64748b' }}>
        Logged in as Administrator: <strong>{customer?.name}</strong> ({customer?.email})
      </p>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>Total Fleet</h4>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1d4ed8' }}>{totalVehicles}</span>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#166534' }}>Available Vehicles</h4>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#15803d' }}>{availableVehicles}</span>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#991b1b' }}>Booked / Unavailable</h4>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#b91c1c' }}>{bookedVehicles}</span>
        </div>
      </div>

      <h3>Fleet Status Table</h3>
      {loading ? (
        <p>Loading fleet data...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '10px' }}>Model</th>
              <th style={{ padding: '10px' }}>Type</th>
              <th style={{ padding: '10px' }}>Rate/Day</th>
              <th style={{ padding: '10px' }}>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{v.model}</td>
                <td style={{ padding: '10px' }}>{v.type}</td>
                <td style={{ padding: '10px' }}>${v.pricePerDay}</td>
                <td style={{ padding: '10px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: v.available ? '#dcfce7' : '#fee2e2',
                      color: v.available ? '#15803d' : '#b91c1c'
                    }}
                  >
                    {v.available ? 'Available' : 'Booked'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
