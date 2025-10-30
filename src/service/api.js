// API configuration and utilities
const API_BASE_URL = 'http://127.0.0.1:8000/api/climate';

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset_password`,
  UPDATE_PASSWORD: `${API_BASE_URL}/auth/update_password`,
  
  // User endpoints
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  
  // Event endpoints
  EVENTS: `${API_BASE_URL}/event/`,
  EVENT_BY_ID: (id) => `${API_BASE_URL}/event/${id}`,
  
  // Category endpoints
  CATEGORIES: `${API_BASE_URL}/category`,
  CATEGORY_BY_ID: (id) => `${API_BASE_URL}/category/${id}`,
};

// Generic API call helper
export const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    headers: getAuthHeaders(),
  };
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    console.log('🌐 Making API call to:', url);
    console.log('📋 Request config:', config);
    
    const response = await fetch(url, config);
    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok:', response.ok);
    
    const data = await response.json();
    console.log('📋 Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.detail || `HTTP error! status: ${response.status}`);
    }
    
    return { data, success: true };
  } catch (error) {
    console.error('API call failed:', error);
    return { error: error.message, success: false };
  }
};

// Public API call helper (no authentication required)
export const publicApiCall = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    console.log('🌐 Making public API call to:', url);
    console.log('📋 Request config:', config);
    
    const response = await fetch(url, config);
    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok:', response.ok);
    
    const data = await response.json();
    console.log('📋 Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.detail || `HTTP error! status: ${response.status}`);
    }
    
    return { data, success: true };
  } catch (error) {
    console.error('Public API call failed:', error);
    return { error: error.message, success: false };
  }
};

// Helper for FormData API calls (for file uploads)
export const apiCallFormData = async (url, formData, options = {}) => {
  const token = localStorage.getItem('access_token');
  const headers = {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
  
  const config = {
    method: 'POST',
    headers,
    body: formData,
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || `HTTP error! status: ${response.status}`);
    }
    
    return { data, success: true };
  } catch (error) {
    console.error('API call failed:', error);
    return { error: error.message, success: false };
  }
};
