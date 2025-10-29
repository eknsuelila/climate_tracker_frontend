import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaFolder, FaClipboardCheck, FaUsers, FaCog, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>

        <div className="sidebar-menu">
          <Button
            className="sidebar-btn"
            onClick={() => navigate("/admin/category")}
          >
            <FaFolder className="me-2" /> Category
          </Button>
          <Button
            className="sidebar-btn"
            onClick={() => navigate("/admin/events")}
          >
            <FaClipboardCheck className="me-2" /> Events
          </Button>
          <Button
            className="sidebar-btn"
            onClick={() => navigate("/admin/users")}
          >
            <FaUsers className="me-2" /> Users
          </Button>
          <Button
            className="sidebar-btn"
            onClick={() => navigate("/admin/settings")}
          >
            <FaCog className="me-2" /> Settings
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Container>
          {/* Welcome Card */}
          <Row className="mb-4">
            <Col>
              <Card className="admin-card text-center p-4">
                <Card.Body>
                  <h1>Welcome, Admin!</h1>
                  <p>Manage categories, events, users, and settings from the sidebar.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Dashboard Cards */}
          <Row xs={1} md={3} className="g-4">
            <Col>
              <Card className="admin-card text-center">
                <Card.Body>
                  <h5>Categories</h5>
                  <p>View and manage all categories</p>
                  <Button className="login-btn me-2" onClick={() => navigate("/admin/category")}><FaPlus /> Add</Button>
                  <Button className="login-btn" onClick={() => navigate("/admin/category")}><FaEdit /> Edit</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="admin-card text-center">
                <Card.Body>
                  <h5>Events</h5>
                  <p>View and manage all events</p>
                  <Button className="login-btn me-2" onClick={() => navigate("/admin/events")}><FaPlus /> Add</Button>
                  <Button className="login-btn" onClick={() => navigate("/admin/events")}><FaEdit /> Edit</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="admin-card text-center">
                <Card.Body>
                  <h5>Users</h5>
                  <p>View and manage all users</p>
                  <Button className="login-btn me-2" onClick={() => navigate("/admin/users")}><FaEdit /> Edit</Button>
                  <Button className="login-btn" onClick={() => navigate("/admin/users")}><FaTrash /> Delete</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default Admin;
