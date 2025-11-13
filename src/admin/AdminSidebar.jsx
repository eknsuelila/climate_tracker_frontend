import React from "react";
import { Button } from "react-bootstrap";
import { FaFolder, FaClipboardCheck, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    // Example: remove stored user/admin data if any
    localStorage.removeItem("adminUser");

    // Navigate to login page
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>

      <div className="sidebar-menu">
        <Button className="sidebar-btn" onClick={() => navigate("/admin/category")}>
          <FaFolder className="me-2" /> Category
        </Button>
        <Button className="sidebar-btn" onClick={() => navigate("/admin/events")}>
          <FaClipboardCheck className="me-2" /> Events
        </Button>
        <Button className="sidebar-btn" onClick={() => navigate("/admin/users")}>
          <FaUsers className="me-2" /> Users
        </Button>
        <Button className="sidebar-btn" onClick={() => navigate("/admin/settings")}>
          <FaCog className="me-2" /> Settings
        </Button>
      </div>

      {/* ===== Logout Button ===== */}
      <div className="sidebar-footer">
        <Button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
