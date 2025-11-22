import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../service/api.js';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear field error on change
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: '', email: '', password: '' };

    const trimmedUsername = formData.username.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    // Username validation
    if (!trimmedUsername) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (trimmedUsername.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      valid = false;
    }

    // Email validation
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      newErrors.email = 'Enter a valid email';
      valid = false;
    }

    // Strong password validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!trimmedPassword) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (!strongPasswordRegex.test(trimmedPassword)) {
      newErrors.password =
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail = typeof data?.detail === 'string' ? data.detail : 'Registration failed';
        toast.error(`⚠️ ${detail}`, {
          position: 'top-right',
          autoClose: 4000,
          theme: 'colored',
          transition: Bounce,
        });
      } else {
        toast.success('✅ Your account has been created. Redirecting to login...', {
          position: 'top-right',
          autoClose: 2500,
          theme: 'colored',
          transition: Bounce,
        });
        setTimeout(() => navigate('/login'), 800);
      }
    } catch (error) {
      toast.error('⚠️ Network error. Please try again later.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'colored',
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
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
            />
            {errors.username && <div className="text-danger mt-1">{errors.username}</div>}
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
            />
            {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
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
            />
            {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <a href="/login" className="text-link mt-3 d-block">
          Already have an account? Login
        </a>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default RegistrationPage;
