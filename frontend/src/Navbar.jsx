// Navigation Bar Component
// Contains links to all application routes and a logout button
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Navbar = () => {
  const { customer, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    fontFamily: 'sans-serif'
  };

  const linkStyle = {
    color: '#93c5fd',
    textDecoration: 'none',
    marginRight: '16px',
    fontWeight: '500'
  };

  const buttonStyle = {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <nav style={navStyle}>
      <div>
        <strong style={{ fontSize: '18px', marginRight: '20px', color: '#ffffff' }}>
          DriveEasy Car Rental
        </strong>
        {token && (
          <>
            <Link to="/fleet" style={linkStyle}>Fleet</Link>
            <Link to="/my-bookings" style={linkStyle}>My Bookings</Link>
            <Link to="/admin" style={linkStyle}>Admin Panel</Link>
          </>
        )}
      </div>

      <div>
        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#cbd5e1' }}>
              Logged in as: <strong>{customer?.name || 'Customer'}</strong> ({customer?.role})
            </span>
            <button onClick={handleLogout} style={buttonStyle}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/" style={linkStyle}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
