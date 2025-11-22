import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../service/auth.jsx";
import { API_ENDPOINTS } from "../service/api.js";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear field error on change
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    // Email validation
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }

    // Password validation
    if (!trimmedPassword) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (trimmedPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return; // Stop submission if validation fails

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail =
          typeof data?.detail === "string" ? data.detail : "Invalid email or password";
        toast.error(`⚠️ ${detail}`, {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.access_token, data.user);

        toast.success("✅ Login successful. Redirecting...", {
          position: "top-right",
          autoClose: 1500,
          theme: "colored",
          transition: Bounce,
        });

        const userRole = data.user?.role || "EndUser";
        setTimeout(() => {
          if (userRole === "Admin") navigate("/admin");
          else navigate("/profile");
        }, 150);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error(err);
      }
      toast.error("⚠️ Network error. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
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

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                    {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                    {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
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

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default Login;
