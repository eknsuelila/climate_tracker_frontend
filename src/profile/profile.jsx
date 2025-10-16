import React from "react";
import "./profile.css";
import { NavLink } from "react-router-dom";

const Profile = () => {
  // Example user data
  const user = {
    name: "Taniya Ann Mariya",
    email: "taniya@example.com",
    role: "Full Stack Developer",
    avatar: "https://i.pravatar.cc/150?img=12" // placeholder avatar
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
          <p><strong>Role:</strong> {user.role}</p>
          <NavLink to="/edit-profile">
  <button className="edit-btn rounded-pill">Edit Profile</button>
</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Profile;
