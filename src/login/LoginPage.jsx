import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login Data:", formData);
    alert("Check the console for the login data.");
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={5}>
            <Card className="login-card shadow-lg p-4">
              <Card.Body>
                <h2 className="text-center mb-4">Welcome Back 👋</h2>
                <p className="text-center text-muted mb-4">
                  Login to your Climate Chronicler account
                </p>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="info"
                    className="w-100 fw-semibold login-btn"
                  >
                    Log In
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <Link to="/reset" className="text-link">
                    Forgot Password?
                  </Link>
                </div>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-link">
                      Register
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
