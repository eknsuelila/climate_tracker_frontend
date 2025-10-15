import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../service/auth.jsx";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' | 'error'

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/climate/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        const detail = typeof data?.detail === "string" ? data.detail : "Invalid email or password";
        setMessage(detail);
        setMessageType("error");
      } else {
        localStorage.setItem("access_token", data.access_token);
        login(data.access_token); // Update global auth state
        setMessage("Login successful. Redirecting...");
        setMessageType("success");
        setTimeout(() => navigate("/"), 600);
      }
    } catch {
      setMessage("Network error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
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
                {message && (
                  <div className={`login-message ${messageType || ""}`}>
                    <div className="login-message-inner">
                      <div className="login-message-icon" aria-hidden="true">
                        {messageType === "success" ? "✅" : "⚠️"}
                      </div>
                      <div className="login-message-content">
                        <div className="login-message-title">
                          {messageType === "success" ? "Success" : "Notice"}
                        </div>
                        <div className="login-message-body">{message}</div>
                      </div>
                    </div>
                  </div>
                )}

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
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Log In"}
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
