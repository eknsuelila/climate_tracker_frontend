import React, { useState } from 'react';
import './RegistrationPage.css';

const RegistrationPage = () => {
  // State Management
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Event Handlers
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Registering with:', formData);
    alert('Check the console for the registration data.');
  };

  return (
    <div className="registration-page">
      <div className="registration-card">
        <h2>Create an Account</h2>
        <p>Join us today! It takes only a few steps.</p>
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
          <button type="submit" className="register-btn">Register</button>
        </form>
        <a href="/login" className="text-link">
          Already have an account? Login
        </a>
      </div>
    </div>
  );
};

export default RegistrationPage;
