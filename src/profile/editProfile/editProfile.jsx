import React, { useState, useEffect } from "react";
import "./editProfile.css";
import { NavLink, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../service/api.js";
import { toast } from "react-toastify";

const EditProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [user, setUser] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
    country: "",
    role: "",
    linked_in_url: "",
    github_url: "",
    portfolio_url: "",
  });

  const [loading, setLoading] = useState(true);

  // 🟡 Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        toast.warning("Please log in first!");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(API_ENDPOINTS.USER_BIO, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile data");

        const data = await res.json();
        setUser({
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          location: data.location || "",
          country: data.country || "",
          role: data.role || "EndUser",
          linked_in_url: data.linked_in_url || "",
          github_url: data.github_url || "",
          portfolio_url: data.portfolio_url || "",
        });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🟡 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Submit updates
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      toast.info("Updating profile...");

      const res = await fetch(API_ENDPOINTS.USER_BIO_update, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      await res.json();
      toast.success("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return (
      <div className="edit-profile-page">
        <h3>Loading profile...</h3>
      </div>
    );

  return (
    <div className="edit-profile-page">
      <h1>Edit Profile</h1>

      <form className="edit-profile-card" onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={user.username} disabled className="input-field" />
        </label>

        <label>
          Email:
          <input type="email" name="email" value={user.email} disabled className="input-field" />
        </label>

        <label>
          Role:
          <input type="text" name="role" value={user.role} onChange={handleChange} className="input-field" />
        </label>

        <label>
          Location:
          <input type="text" name="location" value={user.location} onChange={handleChange} className="input-field" />
        </label>

        <label>
          Country:
          <input type="text" name="country" value={user.country} onChange={handleChange} className="input-field" />
        </label>

        <label>
          Bio:
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
            className="input-textarea"
            rows="4"
          />
        </label>

        <div className="social-links-edit">
          <h3>Social Links</h3>

          <label>
            LinkedIn:
            <input
              type="text"
              name="linked_in_url"
              value={user.linked_in_url}
              onChange={handleChange}
              className="input-field"
            />
          </label>

          <label>
            GitHub:
            <input
              type="text"
              name="github_url"
              value={user.github_url}
              onChange={handleChange}
              className="input-field"
            />
          </label>

          <label>
            Portfolio:
            <input
              type="text"
              name="portfolio_url"
              value={user.portfolio_url}
              onChange={handleChange}
              className="input-field"
            />
          </label>
        </div>

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
