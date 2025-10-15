import React from "react";
import { useAuth } from "../service/auth.jsx";
import { Container, Row, Col, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar-main shadow-sm py-3 px-4">
      <Container fluid>
        <Row className="align-items-center justify-content-between">
          {/* Logo */}
          <Col xs="auto">
            <div className="navbar-logo">
              <span className="logo-icon">🌎</span>
              <span className="logo-text">
                CLIMATE <span className="highlight">CHRONICLER</span>
              </span>
            </div>
          </Col>

          {/* Navigation Links */}
          <Col className="d-none d-md-flex justify-content-center nav-links">
            <NavLink
              to="/timeline"
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
            >
              TIMELINE
            </NavLink>
            <NavLink
              to="/map"
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
            >
              MAP
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
            >
              ANALYTICS
            </NavLink>
          </Col>

          {/* Buttons */}
          <Col xs="auto" className="d-flex align-items-center gap-3">
            <NavLink to="/submit-event">
              <Button variant="outline-info" className="rounded-pill px-3">
                SUBMIT AN EVENT
              </Button>
            </NavLink>

            {user ? (
              <div className="d-flex align-items-center gap-3">
                <NavLink to="/profile">
                  <Button variant="outline-info" className="rounded-pill px-3">
                    PROFILE
                  </Button>
                </NavLink>
                <Button variant="outline-secondary" onClick={handleLogout} className="rounded-pill px-3">
                  LOGOUT
                </Button>
              </div>
            ) : (
              <Button variant="outline-secondary" className="rounded-pill px-3">
                <NavLink to="/login" className="text-decoration-none text-reset">
                  LOGIN
                </NavLink>
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Navbar;
