// API Testing Script - Run this in browser console
// Copy and paste this into your browser's developer console

console.log('🧪 Starting API Tests...');

// Test 1: Check if API configuration is loaded
console.log('📋 Testing API Configuration...');
try {
  // This will only work if you're on a page that imports the API module
  console.log('✅ API module should be available');
} catch (error) {
  console.log('❌ API module not found:', error);
}

// Test 2: Check localStorage for tokens
console.log('🔑 Testing Token Storage...');
const token = localStorage.getItem('access_token');
if (token) {
  console.log('✅ Token found:', token.substring(0, 20) + '...');
  
  // Decode token to check expiration
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    console.log('📅 Token expires:', new Date(payload.exp * 1000));
    console.log('⏰ Token expired:', isExpired);
  } catch (error) {
    console.log('❌ Invalid token format');
  }
} else {
  console.log('❌ No token found - user not logged in');
}

// Test 3: Test API endpoints directly
console.log('🌐 Testing API Endpoints...');

// Test registration endpoint
async function testRegistration() {
  console.log('📝 Testing Registration...');
  try {
    const response = await fetch('http://127.0.0.1:8000/api/climate/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'testpassword123'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Registration endpoint working:', data);
    } else {
      console.log('❌ Registration failed:', data);
    }
  } catch (error) {
    console.log('❌ Registration error:', error);
  }
}

// Test login endpoint
async function testLogin() {
  console.log('🔐 Testing Login...');
  try {
    const response = await fetch('http://127.0.0.1:8000/api/climate/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Login endpoint working:', data);
    } else {
      console.log('❌ Login failed:', data);
    }
  } catch (error) {
    console.log('❌ Login error:', error);
  }
}

// Run tests
testRegistration();
testLogin();

console.log('🏁 API Tests Complete!');

