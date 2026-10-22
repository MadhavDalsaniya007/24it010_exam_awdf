// Protected Route Component
// Redirects unauthenticated users to the Login page ("/")
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Render child protected component if authenticated
  return children;
};

export default ProtectedRoute;
