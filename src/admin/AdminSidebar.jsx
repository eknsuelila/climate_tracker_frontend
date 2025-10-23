import { NavLink } from "react-router-dom";
import { FaFolder, FaClipboardCheck, FaUsers, FaCog, FaHome } from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <div className="sidebar-menu">
        {/* Dashboard / Home */}
        <NavLink to="/admin" className="sidebar-btn">
          <FaHome className="me-2" /> Dashboard
        </NavLink>

        {/* Other links */}
        <NavLink to="/admin/category" className="sidebar-btn">
          <FaFolder className="me-2" /> Category
        </NavLink>
        <NavLink to="/admin/events" className="sidebar-btn">
          <FaClipboardCheck className="me-2" /> Events
        </NavLink>
        <NavLink to="/admin/users" className="sidebar-btn">
          <FaUsers className="me-2" /> Users
        </NavLink>
        <NavLink to="/admin/settings" className="sidebar-btn">
          <FaCog className="me-2" /> Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
