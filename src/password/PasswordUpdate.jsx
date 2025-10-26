import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import "./PasswordReset.css";

const PasswordUpdate = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL query
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    if (!tokenFromURL) {
      alert("Invalid or missing token!");
      navigate("/login");
    }
    setToken(tokenFromURL);
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    const { data, success, error } = await apiCall(API_ENDPOINTS.UPDATE_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ token, new_password: password }),
    });

    if (success) {
      alert("✅ Password updated successfully! Please login again.");
      navigate("/login");
    } else {
      alert(`❌ ${error || "Failed to update password"}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <h2 className="reset-title">🔒 Update Password</h2>
        <p className="reset-description">
          Enter your new password below to complete the reset process.
        </p>

        <form onSubmit={handleSubmit} className="reset-form">
          <label htmlFor="password" className="reset-label">New Password</label>
          <input
            type="password"
            id="password"
            className="reset-input"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirm" className="reset-label">Confirm Password</label>
          <input
            type="password"
            id="confirm"
            className="reset-input"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit" className="reset-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="reset-footer">
          <a href="/login" className="reset-link">← Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdate;
