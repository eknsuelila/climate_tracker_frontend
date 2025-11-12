import React, { useState } from "react";
import "./editProfile.css";
import { NavLink, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  // Pre-filled example user data
  const [user, setUser] = useState({
    name: "Taniya Ann Mariya",
    email: "taniya@example.com",
    location: "Vancouver, British Columbia, Canada",
    role: "Full Stack Developer",
    joined: "April 2024",
    bio: "Active contributor to environmental awareness and sustainability tracking.",
    social: {
      linkedin: "https://www.linkedin.com/in/taniyaannmariya",
      github: "https://github.com/taniya545",
      portfolio: "https://climatechronicle.netlify.app",
    },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const key = name.split(".")[1];
      setUser((prev) => ({ ...prev, social: { ...prev.social, [key]: value } }));
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated user:", user);
    navigate("/profile");
  };

  return (
    <div className="edit-profile-page">
      <h1>Edit Profile</h1>

      <form className="edit-profile-card" onSubmit={handleSubmit}>
        {/* ===== Basic Info Section ===== */}
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="input-field"
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="input-field"
          />
        </label>

        <label>
          Location:
          <input
            type="text"
            name="location"
            value={user.location}
            onChange={handleChange}
            className="input-field"
          />
        </label>

        <label>
          Role:
          <input
            type="text"
            name="role"
            value={user.role}
            onChange={handleChange}
            className="input-field"
          />
        </label>

        <label>
          Member Since:
          <input
            type="text"
            name="joined"
            value={user.joined}
            onChange={handleChange}
            className="input-field"
          />
        </label>

        <label>
          About:
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
            className="input-textarea"
            rows="4"
          />
        </label>

        {/* ===== Social Links ===== */}
        <div className="social-links-edit">
          <h3>Social Links</h3>

          <label>
            LinkedIn:
            <input
              type="text"
              name="social.linkedin"
              value={user.social.linkedin}
              onChange={handleChange}
              className="input-field"
            />
          </label>

          <label>
            GitHub:
            <input
              type="text"
              name="social.github"
              value={user.social.github}
              onChange={handleChange}
              className="input-field"
            />
          </label>

          <label>
            Portfolio:
            <input
              type="text"
              name="social.portfolio"
              value={user.social.portfolio}
              onChange={handleChange}
              className="input-field"
            />
          </label>
        </div>

        {/* ===== Buttons ===== */}
        <div className="form-actions">
          <button type="submit" className="save-btn rounded-pill">
            Save Changes
          </button>
          <NavLink to="/profile">
            <button type="button" className="cancel-btn rounded-pill">
              Cancel
            </button>
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
