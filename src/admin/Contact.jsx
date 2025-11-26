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
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletedFilter, setDeletedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // <-- Search state

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Fetch all contacts
  const fetchContacts = async () => {
    setLoading(true);
    const { data, success } = await apiCall(API_ENDPOINTS.CONTACT);

    if (success) {
      // Handle paginated response: data.items contains the array, or data itself if it's an array
      const contactsArray = Array.isArray(data) ? data : (data.items || []);
      const sorted = contactsArray.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setContacts(sorted);
      setFilteredContacts(sorted);
    } else {
      toast.error("❌ Failed to fetch contacts");
      setContacts([]);
      setFilteredContacts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Apply filters & search
  useEffect(() => {
    let list = contacts;

    if (statusFilter !== "all") {
      list = list.filter((c) =>
        statusFilter === "resolved" ? c.status === true : c.status === false
      );
    }

    if (deletedFilter !== "all") {
      list = list.filter((c) =>
        deletedFilter === "deleted" ? c.is_deleted === true : c.is_deleted === false
      );
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.subject.toLowerCase().includes(term)
      );
    }

    setFilteredContacts(list);
    setCurrentPage(1);
  }, [statusFilter, deletedFilter, searchTerm, contacts]);

  // Open modal
  const openModal = (contact) => {
    setCurrentContact(contact);
    setShowModal(true);
  };

  // Close modal
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

  // Delete contact
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

  // Pagination calculations
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredContacts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

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
              <h1>Contact Management</h1>
              <p>View and manage user inquiries</p>
            </Card>
          </Col>
        </Row>

        {/* FILTERS + SEARCH */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={deletedFilter}
              onChange={(e) => setDeletedFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="deleted">Deleted</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>

        {/* TABLE */}
        <Row>
          <Col>
            <Card className="admin-card p-4">
              <h5 className="text-center mb-3">
                Contacts ({filteredContacts.length})
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
                  ) : currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={7}>No contacts found</td>
                    </tr>
                  ) : (
                    currentItems.map((c, index) => (
                      <tr key={c.id}>
                        <td>{indexOfFirst + index + 1}</td>
                        <td>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.subject}</td>
                        <td>
                          <Badge bg={c.status ? "success" : "secondary"}>
                            {c.status ? "Resolved" : "Pending"}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={c.is_deleted ? "danger" : "info"}>
                            {c.is_deleted ? "Deleted" : "Active"}
                          </Badge>
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

              {/* PAGINATION */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  variant="secondary"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>

                <div>
                  Page {currentPage} of {totalPages}
                </div>

                <Button
                  variant="secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* MODAL */}
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

              <Form.Group className="mt-3">
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
    </>
  );
};

export default AdminContacts;
