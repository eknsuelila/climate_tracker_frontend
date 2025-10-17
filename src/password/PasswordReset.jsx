import React, { useState } from "react";
import "./PasswordReset.css";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/climate/auth/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("✅ If this email is registered, a password reset link has been sent to your inbox.");
        setEmail("");
      } else {
        const err = await response.json();
        alert(`❌ ${err.detail || "Failed to send reset link."}`);
      }
    } catch (error) {
      alert("⚠️ Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <h2 className="reset-title">🔒 Reset Password</h2>
        <p className="reset-description">
          Enter your registered email address below and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="reset-form">
          <label htmlFor="email" className="reset-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="reset-input"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            required
          />

          <button type="submit" className="reset-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="reset-footer">
          <a href="/login" className="reset-link">
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
