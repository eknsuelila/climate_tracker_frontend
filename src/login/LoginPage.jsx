// src/LoginPage.jsx

import React, { useState } from 'react';

const LoginPage = () => {
  // State Management
  const [formData, setFormData] = useState({
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
    console.log('Login attempt with:', formData);
    alert('Check the console for the login data.');
  };

  // JSX Markup
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
        <p>
        <a href="/password-reset">Forgot Password?</a>
      </p>
      </form>
    </div>
  );
};

export default LoginPage;