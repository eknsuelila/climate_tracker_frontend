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
import { FaTrash, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import "./admin.css";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All"); // All / Pending / Resolved
  const [deletedFilter, setDeletedFilter] = useState("All"); // All / Active / Deleted
  const [sortOrder, setSortOrder] = useState("Newest");

  // Fetch all contacts
  const fetchContacts = async () => {
    setLoading(true);
    const { data, success } = await apiCall(API_ENDPOINTS.CONTACT);

    if (success) {
      const mapped = data.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        subject: c.subject,
        message: c.message,
        status: c.status,
        created_at: new Date(c.created_at),
        updated_at: new Date(c.updated_at),
        is_deleted: c.is_deleted,
      }));

      setContacts(mapped);
      setFilteredContacts(mapped);
    } else {
      toast.error("❌ Failed to fetch contacts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Apply Filters + Sorting
  useEffect(() => {
    let result = [...contacts];

    // Filter by Status
    if (statusFilter !== "All") {
      result = result.filter((c) =>
        statusFilter === "Resolved" ? c.status === true : c.status === false
      );
    }

    // Filter by Deleted
    if (deletedFilter === "Active") {
      result = result.filter((c) => c.is_deleted === false);
    } else if (deletedFilter === "Deleted") {
      result = result.filter((c) => c.is_deleted === true);
    }

    // Sorting
    result.sort((a, b) =>
      sortOrder === "Newest"
        ? b.created_at - a.created_at
        : a.created_at - b.created_at
    );

    setFilteredContacts(result);
  }, [statusFilter, deletedFilter, sortOrder, contacts]);

  // Modal
  const openModal = (contact) => {
    setCurrentContact(contact);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentContact(null);
  };

  // Update status
  const updateStatus = async () => {
    if (!currentContact) return;

    const updatedStatus = currentContact.status;

    const { data, success } = await apiCall(
      `${API_ENDPOINTS.CONTACT}/${currentContact.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updatedStatus }),
      }
    );

    if (success) {
      setContacts(
        contacts.map((c) =>
          c.id === currentContact.id ? { ...c, status: data.status } : c
        )
      );

      toast.success("Status updated");
      closeModal();
    } else {
      toast.error("Failed to update status");
    }
  };

  // Delete
  const deleteContact = async (id) => {
    const { success } = await apiCall(`${API_ENDPOINTS.CONTACT}/${id}`, {
      method: "DELETE",
    });

    if (success) {
      setContacts(contacts.filter((c) => c.id !== id));
      toast.success("🗑 Contact deleted");
    } else {
      toast.error("❌ Failed to delete contact");
    }
  };

  return (
    <div className="admin-page">
      <ToastContainer />

      <Container className="admin-main">

        <Row className="mb-4">
          <Col>
            <Card className="admin-card text-center p-4">
              <h1>Contact Management</h1>
              <p>View and manage user inquiries</p>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Select
              value={deletedFilter}
              onChange={(e) => setDeletedFilter(e.target.value)}
            >
              <option value="All">All Contacts</option>
              <option value="Active">Active Only</option>
              <option value="Deleted">Deleted Only</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
            </Form.Select>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="admin-card p-4">
              <h5 className="text-center mb-3">
                All Contacts ({filteredContacts.length})
              </h5>

              <Table striped bordered hover responsive className="text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Deleted</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7}>Loading...</td>
                    </tr>
                  ) : filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={7}>No contacts found</td>
                    </tr>
                  ) : (
                    filteredContacts.map((c, index) => (
                      <tr key={c.id}>
                        <td>{index + 1}</td>
                        <td>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.subject}</td>

                        <td>
                          <Badge bg={c.status ? "success" : "secondary"}>
                            {c.status ? "Resolved" : "Pending"}
                          </Badge>
                        </td>

                        <td>
                          {c.is_deleted ? (
                            <Badge bg="danger">Deleted</Badge>
                          ) : (
                            <Badge bg="primary">Active</Badge>
                          )}
                        </td>

                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => openModal(c)}
                          >
                            <FaEye />
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteContact(c.id)}
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

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contact Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {currentContact && (
            <>
              <p>
                <strong>Name:</strong> {currentContact.name}
              </p>
              <p>
                <strong>Email:</strong> {currentContact.email}
              </p>
              <p>
                <strong>Subject:</strong> {currentContact.subject}
              </p>
              <p>
                <strong>Message:</strong> {currentContact.message}
              </p>

              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={currentContact.status ? "Resolved" : "Pending"}
                  onChange={(e) =>
                    setCurrentContact({
                      ...currentContact,
                      status: e.target.value === "Resolved",
                    })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button className="login-btn" onClick={updateStatus}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminContacts;
