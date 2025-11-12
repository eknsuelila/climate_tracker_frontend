import React from "react";
import "./profile.css";
import { NavLink } from "react-router-dom";

const Profile = () => {
  // Example user data
  const user = {
    name: "Taniya Ann Mariya",
    email: "taniya.mariya@example.com",
    location: "Vancouver, British Columbia, Canada",
    role: "Environmental Data Analyst",
    joined: "April 2024",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Active contributor to environmental awareness. Passionate about tracking air quality, temperature shifts, and sustainability trends across BC.",
    stats: {
      events: 156,
      contributions: 48,
      lastUpdate: "Nov 10, 2025",
    },
    social: {
      linkedin: "https://www.linkedin.com/in/taniyaannmariya",
      github: "https://github.com/taniya545",
      portfolio: "https://climatechronicle.netlify.app",
    },
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="avatar-container">
          <img src={user.avatar} alt="Profile Avatar" className="avatar" />
        </div>

        <div className="profile-info">
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Member Since:</strong> {user.joined}</p>

          <div className="bio">
            <strong>About:</strong>
            <p>{user.bio}</p>
          </div>

          <div className="stats-section">
            <h3>Activity Overview</h3>
            <ul>
              <li><strong>Number of Events:</strong> {user.stats.events}</li>
              <li><strong>Contribution Activity:</strong> {user.stats.contributions}</li>
              <li><strong>Last Update:</strong> {user.stats.lastUpdate}</li>
            </ul>
          </div>

          <div className="social-links">
            <a href={user.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={user.social.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={user.social.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
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
