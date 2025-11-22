import React, { createContext, useContext, useState, useEffect } from 'react';

const IS_DEV = import.meta.env.DEV;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (IS_DEV) {
      console.log('🔍 Checking for stored token:', token ? 'Token found' : 'No token');
    }
    if (token) {
      // Decode token to check expiration
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (IS_DEV) {
          console.log('📋 Token payload:', payload);
          console.log('⏰ Token expires:', new Date(payload.exp * 1000));
          console.log('❌ Token expired:', isExpired);
        }
        
        if (!isExpired) {
          setUser({ 
            isAuthenticated: true,
            email: payload.email,
            role: payload.role,
            userId: payload.sub 
          });
        } else {
          if (IS_DEV) {
            console.log('🗑️ Removing expired token');
          }
          localStorage.removeItem('access_token');
        }
      } catch (error) {
        if (IS_DEV) {
          console.error('❌ Invalid token format:', error);
        }
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    if (IS_DEV) {
      console.log('🔐 Storing token:', token);
    }
    localStorage.setItem('access_token', token);
    setUser({ 
      isAuthenticated: true,
      email: userData.email,
      role: userData.role,
      userId: userData.user_id });
    if (IS_DEV) {
      console.log('✅ User logged in successfully');
    }
  };

  const logout = () => {
    if (IS_DEV) {
      console.log('🚪 Logging out user');
    }
    localStorage.removeItem('access_token');
    setUser(null);
    if (IS_DEV) {
      console.log('✅ User logged out successfully');
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};