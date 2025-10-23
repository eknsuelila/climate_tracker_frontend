import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./admin.css";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setCurrentUser({ name: "", email: "" });
    setEditId(null);
  };

  const handleShow = (user = { name: "", email: "" }, id = null) => {
    setCurrentUser(user);
    setEditId(id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editId) {
      setUsers(users.map(u => (u.id === editId ? { ...u, ...currentUser } : u)));
    } else {
      const newId = users.length ? users[users.length - 1].id + 1 : 1;
      setUsers([...users, { id: newId, ...currentUser }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="admin-page">
      <Container className="admin-main">
        <Row className="mb-4">
          <Col>
            <Card className="admin-card text-center p-4">
              <Card.Body>
                <h1>User Management</h1>
                <p>Add, edit, or delete users below.</p>
                <Button className="login-btn mt-2" onClick={() => handleShow()}>
                  <FaPlus /> Add New User
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row xs={1} md={3} className="g-4">
          {users.map((u) => (
            <Col key={u.id}>
              <Card className="admin-card text-center">
                <Card.Body>
                  <h5>{u.name}</h5>
                  <p>{u.email}</p>
                  <Button className="login-btn me-2" onClick={() => handleShow(u, u.id)}>
                    <FaEdit /> Edit
                  </Button>
                  <Button className="login-btn" onClick={() => handleDelete(u.id)}>
                    <FaTrash /> Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit User" : "Add New User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="userName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={currentUser.name}
                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="userEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
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

export default Users;
