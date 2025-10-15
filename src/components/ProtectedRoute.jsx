import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../service/auth.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can style this better
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
