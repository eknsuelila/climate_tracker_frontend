import React, { useState } from "react";
import "./editProfile.css";

const EditProfile = () => {
  // Example initial user data
  const [user, setUser] = useState({
    name: "Taniya Ann Mariya",
    email: "taniya@example.com",
    role: "Full Stack Developer"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the updated data
    console.log("Updated User Data:", user);
    alert("Profile updated successfully!");
  };

  return (
    <div className="edit-profile-page">
      <h1>Edit Profile</h1>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
        />

        <label>Role</label>
        <input
          type="text"
          name="role"
          value={user.role}
          onChange={handleChange}
        />

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
