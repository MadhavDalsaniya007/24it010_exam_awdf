// Authentication Context and Provider
// Manages authentication state (customer and token) using localStorage
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load initial state from browser localStorage
  const [token, setToken] = useState(() => localStorage.getItem('driveeasy_token') || null);
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem('driveeasy_customer');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login action: saves token and customer info to state and localStorage
  const login = (newToken, newCustomer) => {
    setToken(newToken);
    setCustomer(newCustomer);
    localStorage.setItem('driveeasy_token', newToken);
    localStorage.setItem('driveeasy_customer', JSON.stringify(newCustomer));
  };

  // Logout action: clears state and localStorage
  const logout = () => {
    setToken(null);
    setCustomer(null);
    localStorage.removeItem('driveeasy_token');
    localStorage.removeItem('driveeasy_customer');
  };

  return (
    <AuthContext.Provider value={{ token, customer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access to AuthContext
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
