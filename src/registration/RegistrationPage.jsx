import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/climate/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    
    setLoading(false);
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

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <a href="/login" className="text-link">
          Already have an account? Login
        </a>
      </div>

      {/* Toast Container */}
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
