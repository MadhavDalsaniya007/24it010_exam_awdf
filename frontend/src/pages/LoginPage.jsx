// Login Page
// Authenticates customer using email and license number
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, licenseNumber })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save customer and token into AuthContext
      login(data.token, data.customer);
      navigate('/fleet');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>DriveEasy Login</h2>
      
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. john@example.com"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>Driver's License Number:</label>
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="e.g. DL-1001"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '8px',
            padding: '10px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '4px', fontSize: '12px', color: '#64748b' }}>
        <strong>Demo Credentials:</strong>
        <div>Customer 1: john@example.com / DL-1001</div>
        <div>Customer 2: jane@example.com / DL-2002</div>
        <div>Admin: admin@driveeasy.com / DL-ADMIN-001</div>
      </div>
    </div>
  );
};

export default LoginPage;
