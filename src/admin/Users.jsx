import React, { useState, useEffect } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import "./admin.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    status: true,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    const { data, success, error } = await apiCall(API_ENDPOINTS.USER_MANAGEMENT);
    if (success) {
      setUsers(
        data.map((u) => ({
          id: u.user_id,
          name: u.username,
          email: u.email,
          status: u.status,
        }))
      );
    } else {
      toast.error(`❌ Failed to fetch users: ${error}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setCurrentUser({ name: "", email: "", status: true });
    setEditId(null);
  };

  const handleShow = (user, id) => {
    setCurrentUser(user);
    setEditId(id);
    setShowModal(true);
  };

  // Save edited user
  const handleSave = async () => {
    if (!currentUser.name.trim() || !currentUser.email.trim()) return;

    const { data, success, error } = await apiCall(API_ENDPOINTS.USER_MANAGEMENT, {
      method: "PATCH",
      body: {
        user_id: editId,
        name: currentUser.name,
        email: currentUser.email,
        status: currentUser.status,
      },
    });

    if (success) {
      setUsers(
        users.map((u) =>
          u.id === editId
            ? { ...u, name: data.username, email: data.email, status: data.status }
            : u
        )
      );
      toast.success("✅ User updated successfully");
      handleClose();
    } else {
      toast.error(`❌ Failed to update user: ${error}`);
    }
  };

  // Deactivate user
  const handleDelete = async (id) => {
    const { data, success, error } = await apiCall(API_ENDPOINTS.USER_MANAGEMENT, {
      method: "PATCH",
      body: { user_id: id },
    });

    if (success) {
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, status: data.status } : u
        )
      );
      toast.success("✅ User status updated");
    } else {
      toast.error(`❌ Failed to update status: ${error}`);
    }
  };

  return (
    <div className="admin-page">
      <ToastContainer />
      <Container className="admin-main">
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

        <Row>
          <Col>
            <Card className="admin-card p-4">
              <h5 className="text-center mb-3">
                All Users ({users.length})
              </h5>
              <Table
                striped
                bordered
                hover
                responsive
                className="text-center align-middle"
              >
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
                  {loading ? (
                    <tr>
                      <td colSpan={5}>Loading...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No users found</td>
                    </tr>
                  ) : (
                    users.map((u, index) => (
                      <tr key={u.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{u.name}</strong>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <Badge bg={u.status ? "success" : "secondary"}>
                            {u.status ? "Active" : "Inactive"}
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
                            disabled={!u.status}
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
                value={currentUser.status ? "Active" : "Inactive"}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    status: e.target.value === "Active",
                  })
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
