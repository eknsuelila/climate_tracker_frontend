import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./admin.css"; // keep your original color theme

const Category = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Wildfires" },
    { id: 2, name: "Floods" },
    { id: 3, name: "Droughts" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [editId, setEditId] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setCurrentCategory("");
    setEditId(null);
  };

  const handleShow = (category = "", id = null) => {
    setCurrentCategory(category);
    setEditId(id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!currentCategory.trim()) return;
    if (editId) {
      setCategories(categories.map(cat => (cat.id === editId ? { ...cat, name: currentCategory } : cat)));
    } else {
      const newId = categories.length ? categories[categories.length - 1].id + 1 : 1;
      setCategories([...categories, { id: newId, name: currentCategory }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <div className="admin-main" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
      <Container fluid>
        {/* Header Card */}
        <Row className="mb-4 justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="admin-card text-center p-4">
              <Card.Body>
                <h1 style={{ color: "#1c232b" }}>Category Management</h1>
                <p style={{ color: "#2b3947" }}>Add, edit, or delete categories below.</p>
                <Button className="login-btn mt-2" onClick={() => handleShow()}>
                  <FaPlus /> Add New Category
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Category Cards */}
        <Row xs={1} md={3} className="g-4 justify-content-center">
          {categories.map((cat) => (
            <Col key={cat.id} xs={12} md={6} lg={4}>
              <Card className="admin-card text-center">
                <Card.Body>
                  <h5 style={{ color: "#1c232b" }}>{cat.name}</h5>
                  <Button className="login-btn me-2" onClick={() => handleShow(cat.name, cat.id)}>
                    <FaEdit /> Edit
                  </Button>
                  <Button className="login-btn" onClick={() => handleDelete(cat.id)}>
                    <FaTrash /> Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#1c232b", color: "#fff" }}>
          <Modal.Title>{editId ? "Edit Category" : "Add New Category"}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
          <Form>
            <Form.Group controlId="categoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
                style={{ borderRadius: "10px", border: "1px solid #ced4da", padding: "10px" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#f8f9fa" }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="login-btn" onClick={handleSave}>
            {editId ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Category;
