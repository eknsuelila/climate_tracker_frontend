import React, { useEffect, useState } from "react";
import "./profile.css";
import { NavLink } from "react-router-dom";
import { API_ENDPOINTS } from "../service/api.js";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token"); // JWT token
      if (!token) {
        setError("No authentication token found. Please log in.");
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

        if (!res.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="profile-page"><h3>Loading profile...</h3></div>;
  if (error) return <div className="profile-page error"><p>{error}</p></div>;

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="avatar-container">
          <img
            src={
              user.profile_pic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "user")}`
            }
            alt="Profile Avatar"
            className="avatar"
          />
        </div>

        <div className="profile-info">
          <h2>{user.username}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Location:</strong> {user.location || "Not specified"}</p>
          <p><strong>Country:</strong> {user.country || "Not specified"}</p>
          <p><strong>Role:</strong> {user.role || "EndUser"}</p>
          <p>
            <strong>Member Since:</strong>{" "}
            {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {user.last_updated_at ? new Date(user.last_updated_at).toLocaleDateString() : "N/A"}
          </p>

          {user.bio && (
            <div className="bio">
              <strong>About:</strong>
              <p>{user.bio}</p>
            </div>
          )}

          <div className="stats-section">
            <h3>Activity Overview</h3>
            <ul>
              <li><strong>Events:</strong> {user.events || 0}</li>
              <li><strong>Contributions:</strong> {user.contributions || 0}</li>
            </ul>
          </div>

          <div className="social-links">
            {user.linked_in_url && (
              <a href={user.linked_in_url} target="_blank" rel="noreferrer">LinkedIn</a>
            )}
            {user.github_url && (
              <a href={user.github_url} target="_blank" rel="noreferrer">GitHub</a>
            )}
            {user.portfolio_url && (
              <a href={user.portfolio_url} target="_blank" rel="noreferrer">Portfolio</a>
            )}
          </div>

          <NavLink to="/edit-profile">
            <button className="edit-btn rounded-pill">Edit Profile</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Profile;
