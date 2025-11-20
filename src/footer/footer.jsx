import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer-main">
      <Container>
        <Row className="align-items-center text-center text-md-start">
          {/* Logo */}
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="footer-logo">
              🌎 CLIMATE <span className="highlight">CHRONICLER</span>
            </h5>
            <p className="footer-tagline">
              Tracking environmental change and resilience across BC.
            </p>
          </Col>

          {/* Navigation Links */}
          <Col md={4} className="footer-links mb-3 mb-md-0">
            <Link to="/timeline">Timeline</Link>
            <Link to="/map">Map</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/contact">Contact</Link>
          </Col>

          {/* Copyright */}
          <Col md={4} className="text-md-end">
            <p className="footer-copy mb-0">
              © {new Date().getFullYear()} Climate Chronicler. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
