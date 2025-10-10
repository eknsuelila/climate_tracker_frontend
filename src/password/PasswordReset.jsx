import React, { useState } from "react";
import "./PasswordReset.css";

const PasswordReset = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
    alert("If this email is registered, a reset link will be sent to your inbox.");
    setEmail(""); // Clear field after submission
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <h2 className="reset-title">🔒 Reset Password</h2>
        <p className="reset-description">
          Enter your registered email address below and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="reset-form">
          <label htmlFor="email" className="reset-label">Email Address</label>
          <input
            type="email"
            id="email"
            className="reset-input"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            required
          />

          <button type="submit" className="reset-btn">
            Send Reset Link
          </button>
        </form>

        <div className="reset-footer">
          <a href="/login" className="reset-link">← Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
