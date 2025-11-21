import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Carousel } from "react-bootstrap";
import "./home.css";
import { API_ENDPOINTS } from "../service/api.js";

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.FEATURED_EVENTS);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setFeaturedEvents(data);
      } catch (error) {
        console.error("Error fetching featured events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

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

          {loading ? (
            <p>Loading featured events...</p>
          ) : (
            <Row className="gy-3 gx-3 justify-content-center">
              {featuredEvents.map((event) => (
                <Col key={event.event_id} xs={12} md={4}>
                  <Card className="event-card h-100" style={{ height: "400px" }}>
                    {/* Year as top title */}
                    <Card.Header className="fw-bold text-primary text-center">
                      {event.year}
                    </Card.Header>

                    {/* Carousel for multiple images */}
                    {event.image_urls && event.image_urls.length > 0 && (
                      <Carousel variant="dark">
                        {event.image_urls.map((url, index) => (
                          <Carousel.Item key={index}>
                            <img
                              className="d-block w-100"
                              src={url}
                              alt={`${event.title} image ${index + 1}`}
                              style={{ height: "180px", objectFit: "cover" }}
                            />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    )}

                    <Card.Body style={{ overflow: "hidden" }}>
                      <h6 className="fw-semibold">{event.title}</h6>
                      <p className="text-muted small" style={{ maxHeight: "50px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {event.impact_summary}
                      </p>
                      <p className="small text-secondary mb-0">
                        {event.location} | Severity: {event.severity}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Home;
