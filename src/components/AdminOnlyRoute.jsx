import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../service/auth.jsx';
import { toast, Bounce } from 'react-toastify';

const AdminOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && user && user.role !== "Admin") {
      toast.error("⚠️ Access denied. Admin privileges required.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "Admin") return <Navigate to="/" />;
  return children;
};

export default AdminOnlyRoute;