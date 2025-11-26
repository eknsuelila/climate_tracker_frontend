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
  Pagination,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import "./admin.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // <-- New search state
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    status: true,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    const { data, success, error } = await apiCall(API_ENDPOINTS.USER_MANAGEMENT);
    if (success) {
      const mappedUsers = data.map((u) => ({
        id: u.user_id,
        name: u.username,
        email: u.email,
        status: u.status,
      }));
      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
    } else {
      toast.error(`❌ Failed to fetch users: ${error}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter & search users
  useEffect(() => {
    let tempUsers = [...users];

    // Status filter
    if (statusFilter === "Active") tempUsers = tempUsers.filter((u) => u.status);
    else if (statusFilter === "Inactive") tempUsers = tempUsers.filter((u) => !u.status);

    // Search filter
    if (searchTerm.trim() !== "") {
      tempUsers = tempUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(tempUsers);
    setCurrentPage(1); // reset pagination when filter/search changes
  }, [statusFilter, searchTerm, users]);

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
      const updatedUsers = users.map((u) =>
        u.id === editId ? { ...u, name: data.username, email: data.email, status: data.status } : u
      );
      setUsers(updatedUsers);
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
      const updatedUsers = users.map((u) =>
        u.id === id ? { ...u, status: data.status } : u
      );
      setUsers(updatedUsers);
      toast.success("✅ User status updated");
    } else {
      toast.error(`❌ Failed to update status: ${error}`);
    }
  };

  // Pagination helpers
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <ToastContainer />
      <Container>
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
              <h5 className="text-center mb-3">All Users ({filteredUsers.length})</h5>

              {/* Filters */}
              <Row className="mb-3 justify-content-center">
                <Col md={3}>
                  <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
              </Row>

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
                  {loading ? (
                    <tr>
                      <td colSpan={5}>Loading...</td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No users found</td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u, index) => (
                      <tr key={u.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td><strong>{u.name}</strong></td>
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

              {/* Pagination UI */}
              <Pagination className="justify-content-center mt-3">
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              </Pagination>
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
    </>
  );
};

export default Users;
