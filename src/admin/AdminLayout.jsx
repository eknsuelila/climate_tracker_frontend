import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Move your sidebar buttons here
import "./admin.css";

const AdminLayout = () => {
  return (
    <div className="admin-page">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet /> {/* This will render Category, Events, Users, or Settings */}
      </main>
    </div>
  );
};

export default AdminLayout;
