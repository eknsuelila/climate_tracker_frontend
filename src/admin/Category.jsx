import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Badge, Form } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import "./admin.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit
  const [currentCategory, setCurrentCategory] = useState({
    title: "",
    description: "",
    status: 1,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch all categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch from backend
  const fetchCategories = async () => {
    setLoading(true);
    const { data, success, error } = await apiCall(API_ENDPOINTS.CATEGORIES);
    if (success) {
      setCategories(data);
    } else {
      toast.error(`❌ Failed to fetch categories: ${error}`);
    }
    setLoading(false);
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Handle add or edit submit
  const handleSave = async () => {
    setLoading(true);
    try {
      let endpoint, method, body;

      if (modalMode === "add") {
        endpoint = `${API_ENDPOINTS.CATEGORIES}/add`;
        method = "POST";
        body = JSON.stringify(currentCategory);
      } else if (modalMode === "edit" && selectedCategory) {
        endpoint = `${API_ENDPOINTS.CATEGORIES}/${selectedCategory.category_id}`;
        method = "PUT";
        body = JSON.stringify(currentCategory);
      }

      const { success, error } = await apiCall(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (success) {
        toast.success(
          modalMode === "add"
            ? "✅ Category added successfully!"
            : "✅ Category updated successfully!"
        );
        fetchCategories();
        handleClose();
      } else {
        toast.error(`❌ Failed to save category: ${error}`);
      }
    } catch (error) {
      toast.error(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete (soft delete)
  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to deactivate this category?")) {
      setLoading(true);
      const { success, error } = await apiCall(`${API_ENDPOINTS.CATEGORIES}/${categoryId}`, {
        method: "DELETE",
      });

      if (success) {
        toast.success("✅ Category deactivated successfully!");
        fetchCategories();
      } else {
        toast.error(`❌ Failed to delete category: ${error}`);
      }
      setLoading(false);
    }
  };

  // Open modal for add/edit
  const handleShow = (mode, category = null) => {
    setModalMode(mode);
    if (mode === "edit" && category) {
      setSelectedCategory(category);
      setCurrentCategory({
        title: category.title,
        description: category.description,
        status: category.status,
      });
    } else {
      setCurrentCategory({ title: "", description: "", status: 1 });
      setSelectedCategory(null);
    }
    setShowModal(true);
  };

  // Close modal
  const handleClose = () => {
    setShowModal(false);
    setCurrentCategory({ title: "", description: "", status: 1 });
    setSelectedCategory(null);
  };

  // Helper: Get status badge
  const getStatusBadge = (status) => {
    if (status === 1) return <Badge bg="success">Active</Badge>;
    if (status === 2) return <Badge bg="danger">Deactivated</Badge>;
    return <Badge bg="secondary">Unknown</Badge>;
  };

  return (
    <div className="admin-page">
      <Container className="admin-main">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Card className="admin-card text-center p-4">
              <Card.Body>
                <h1>Category Management</h1>
                <p>Manage climate event categories — add, edit, or deactivate.</p>
                <Button
                  className="login-btn mt-2"
                  onClick={() => handleShow("add")}
                  disabled={loading}
                >
                  <FaPlus /> Add New Category
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Row>
          <Col>
            <Card className="admin-card">
              <Card.Header>
                <h5>All Categories ({categories.length})</h5>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center p-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center p-4">
                    <p>No categories found.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat) => (
                          <tr key={cat.category_id}>
                            <td><strong>{cat.title}</strong></td>
                            <td>{cat.description}</td>
                            <td>{getStatusBadge(cat.status)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  onClick={() => handleShow("edit", cat)}
                                  title="Edit"
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDelete(cat.category_id)}
                                  title="Deactivate"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add New Category" : "Edit Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentCategory.title}
                onChange={handleChange}
                placeholder="Enter category title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={currentCategory.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={currentCategory.status}
                onChange={handleChange}
              >
                <option value={1}>Active</option>
                <option value={2}>Deactivated</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="login-btn" onClick={handleSave} disabled={loading}>
            {modalMode === "add" ? "Add Category" : "Update Category"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Container */}
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

export default Category;
