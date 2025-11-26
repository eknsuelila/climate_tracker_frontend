import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import "./admin.css"; // reuse your admin.css

const Settings = () => {
  const [adminName, setAdminName] = useState("Admin Name");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [defaultCategory, setDefaultCategory] = useState("Wildfires");
  const [submissionsEnabled, setSubmissionsEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const handleSaveProfile = () => alert("Profile updated!");
  const handleSaveSystem = () => alert("System settings updated!");

  return (
    <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Card className="admin-card text-center p-3">
              <Card.Body>
                <h1 style={{ color: "#1c232b" }}>Settings</h1>
                <p style={{ color: "#2b3947" }}>Manage profile and system settings</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Profile Settings */}
        <Row className="mb-4">
          <Col>
            <Card className="admin-card p-4">
              <Card.Body>
                <h4 style={{ color: "#1c232b" }}>Profile Settings</h4>
                <Form>
                  <Form.Group className="mb-3" controlId="adminName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="form-control"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="adminEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="form-control"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="adminPassword">
                    <Form.Label>Change Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                    />
                  </Form.Group>
                  <Button className="login-btn" onClick={handleSaveProfile}>
                    Save Profile
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* System Settings */}
        <Row className="mb-4">
          <Col>
            <Card className="admin-card p-4">
              <Card.Body>
                <h4 style={{ color: "#1c232b" }}>System Settings</h4>
                <Form>
                  <Form.Group className="mb-3" controlId="notifications">
                    <Form.Check
                      type="switch"
                      label="Enable Email Notifications"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      style={{ color: "#2b3947" }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="defaultCategory">
                    <Form.Label>Default Category</Form.Label>
                    <Form.Control
                      as="select"
                      value={defaultCategory}
                      onChange={(e) => setDefaultCategory(e.target.value)}
                      className="form-control"
                    >
                      <option>Wildfires</option>
                      <option>Floods</option>
                      <option>Droughts</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="submissionsEnabled">
                    <Form.Check
                      type="switch"
                      label="Enable Submissions"
                      checked={submissionsEnabled}
                      onChange={(e) => setSubmissionsEnabled(e.target.checked)}
                      style={{ color: "#2b3947" }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="analyticsEnabled">
                    <Form.Check
                      type="switch"
                      label="Enable Analytics Tracking"
                      checked={analyticsEnabled}
                      onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                      style={{ color: "#2b3947" }}
                    />
                  </Form.Group>

                  <Button className="login-btn" onClick={handleSaveSystem}>
                    Save System Settings
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
    </Container>
  );
};

export default Settings;
