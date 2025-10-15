import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const navigate = useNavigate();
  // State Management
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' | 'error'

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/climate/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show backend validation errors
        console.error('Registration error:', data);
        const detail = typeof data?.detail === 'string' ? data.detail : 'Registration failed';
        setMessage(detail);
        setMessageType('error');
      } else {
        console.log('Registration successful:', data);
        setMessage('Your account has been created. You can now log in.');
        setMessageType('success');
        // Redirect to login after a short delay
        setTimeout(() => navigate('/login'), 800);
        // Optionally, redirect to login page after successful registration
        // window.location.href = "/login";
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage('Network error. Please try again later.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-card">
        <h2>Create an Account</h2>
        <p>Join us today! It takes only a few steps.</p>

        {message && (
          <div className={`message ${messageType || ''}`}>
            <div className="message-inner">
              <div className="message-icon" aria-hidden="true">
                {messageType === 'success' ? '✅' : '⚠️'}
              </div>
              <div className="message-content">
                <div className="message-title">
                  {messageType === 'success' ? 'Success' : 'Notice'}
                </div>
                <div className="message-body">{message}</div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <a href="/login" className="text-link">
          Already have an account? Login
        </a>
      </div>
    </div>
  );
};

export default RegistrationPage;
