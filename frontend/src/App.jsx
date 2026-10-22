// Main Application Component with Routing
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './pages/LoginPage';
import FleetPage from './pages/FleetPage';
import MyBookingsPage from './pages/MyBookingsPage';

// Lazy loading AdminPanel for code splitting
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b' }}>
          <Navbar />
          <main style={{ paddingBottom: '40px' }}>
            <Routes>
              {/* Public route */}
              <Route path="/" element={<LoginPage />} />

              {/* Protected fleet page */}
              <Route
                path="/fleet"
                element={
                  <ProtectedRoute>
                    <FleetPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected my bookings page */}
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected admin page with React.lazy and Suspense */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}>
                      <AdminPanel />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
