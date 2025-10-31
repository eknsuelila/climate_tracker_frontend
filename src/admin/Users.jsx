import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Badge,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./admin.css";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    status: "Active",
  });
  const [editId, setEditId] = useState(null);

  // Close modal
  const handleClose = () => {
    setShowModal(false);
    setCurrentUser({ name: "", email: "", status: "Active" });
    setEditId(null);
  };

  // Show modal for Edit only (Add removed)
  const handleShow = (user, id) => {
    setCurrentUser(user);
    setEditId(id);
    setShowModal(true);
  };

  // Save edited user
  const handleSave = () => {
    if (currentUser.name.trim() === "" || currentUser.email.trim() === "") return;

    setUsers(users.map((u) => (u.id === editId ? { ...u, ...currentUser } : u)));
    handleClose();
  };

  // Delete → change status to Inactive
  const handleDelete = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: "Inactive" } : u
      )
    );
  };

  return (
    <div className="admin-page">
      <Container className="admin-main">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Card className="admin-card text-center p-4">
              <Card.Body>
                <h1>User Management</h1>
                <p>Manage system users — edit or deactivate accounts.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* User Table */}
        <Row>
          <Col>
            <Card className="admin-card p-4">
              <h5 className="text-center mb-3">All Users ({users.length})</h5>
              <Table striped bordered hover responsive className="text-center align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No users found</td>
                    </tr>
                  ) : (
                    users.map((u, index) => (
                      <tr key={u.id}>
                        <td>{index + 1}</td>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td>
                          <Badge
                            bg={u.status === "Active" ? "success" : "secondary"}
                          >
                            {u.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleShow(u, u.id)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(u.id)}
                            disabled={u.status === "Inactive"}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="userName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="userEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="userStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={currentUser.status}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="login-btn" onClick={handleSave}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
