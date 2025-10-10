import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-main shadow-sm py-3 px-4">
      <Container fluid>
        <Row className="align-items-center justify-content-between">
          {/* Logo Section */}
          <Col xs="auto">
            <div className="navbar-logo">
              <span className="logo-icon">🌎</span>
              <span className="logo-text">CLIMATE <span className="highlight">CHRONICLER</span></span>
            </div>
          </Col>

          {/* Navigation Links */}
          <Col className="d-none d-md-flex justify-content-center nav-links">
            <Link to="/timeline" className="nav-item">TIMELINE</Link>
            <Link to="/map" className="nav-item">MAP</Link>
            <Link to="/analytics" className="nav-item">ANALYTICS</Link>
          </Col>

          {/* Buttons Section */}
          <Col xs="auto" className="d-flex align-items-center gap-3">
            <Button variant="outline-info" className="rounded-pill px-3">
              SUBMIT AN EVENT
            </Button>
            <Link to="/login" className="nav-item login">LOGIN</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Navbar;
