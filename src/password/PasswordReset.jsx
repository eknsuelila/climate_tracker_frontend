import React, { useState } from 'react';

const PasswordResetPage = () => {
  // State Management
  const [email, setEmail] = useState('');

  // Event Handlers
  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Password reset requested for email:', email);
    alert('If this email is registered, a reset link will be sent.');
  };

  // JSX Markup
  return (
    <div>
      <h2>Reset Password</h2>
      <p>Enter your email address below, and we'll send you a link to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reset-email">Email Address:</label>
          <input
            type="email"
            id="reset-email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default PasswordResetPage;