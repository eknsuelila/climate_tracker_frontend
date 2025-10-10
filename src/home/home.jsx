import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./home.css";

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <Container fluid className="hero-container">
          <Row className="align-items-center justify-content-center">
            <Col md={7} className="hero-text">
              <h1>STORIES OF A CHANGING BC</h1>
              <p>Explore the interactive chronicle</p>
            </Col>

            <Col md={4}>
              <Card className="ai-card shadow-sm">
                <Card.Body>
                  <h6 className="text-primary fw-bold">AI INSIGHTS</h6>
                  <h5 className="fw-semibold">
                    Wildfires in BC have increased by 150% since the 1990s
                  </h5>
                  <p className="text-muted mb-0">
                    Projections show a further 20% rise by 2030
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Events Section */}
      <div className="featured-section">
        <Container>
          <h6 className="text-primary fw-bold mb-3">FEATURED EVENTS</h6>
          <Row className="gy-3 gx-3 justify-content-center">
            <Col xs={12} md={3}>
              <Card className="event-card">
                <Card.Body>1980: Hecate Strait Oil Spill</Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={3}>
              <Card className="event-card">
                <Card.Body>1997: Pine Beetle Infestation</Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={3}>
              <Card className="event-card">
                <Card.Body>2021: Lytton Heatwave</Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
