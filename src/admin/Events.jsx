// --- imports remain the same ---
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Badge, Alert, Pagination } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaStar } from "react-icons/fa";
import { API_ENDPOINTS, apiCall, publicApiCall } from "../service/api.js";
import EventForm from "../components/EventForm.jsx";
import "./admin.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  // Filter & sort states
  const [filterStatus, setFilterStatus] = useState(""); // "", "1", "2", "3"
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFeatured, setFilterFeatured] = useState(""); // "", "featured", "not_featured"
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    const { data, success, error } = await apiCall(API_ENDPOINTS.EVENTS);

    if (success) setEvents(data);
    else {
      setMessage(`Failed to load events: ${error}`);
      setMessageType("error");
    }
    setLoading(false);
  };

  // Fetch categories
  const fetchCategories = async () => {
    const { data, success } = await publicApiCall(API_ENDPOINTS.CATEGORIES);
    console.log(data)
    if (success) setCategories(data);
  };

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  // Pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Filter & sort events
  const filteredEvents = events
    .filter((event) =>
      (filterStatus === "" || event.status === parseInt(filterStatus)) &&
      (filterCategory === "" || event.category_name === filterCategory) &&
      (filterFeatured === "" ||
        (filterFeatured === "featured" && event.is_featured) ||
        (filterFeatured === "not_featured" && !event.is_featured))
    )
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.date) - new Date(a.date);
      else return new Date(a.date) - new Date(b.date);
    });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal handling
  const handleClose = () => {
    setShowModal(false);
    setShowViewModal(false);
    setCurrentEvent(null);
    setModalMode("add");
  };

  const handleShowModal = (mode, event = null) => {
    setModalMode(mode);
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleShowView = (event) => {
    setCurrentEvent(event);
    setShowViewModal(true);
  };

  // Form submission
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setMessage(null);
    try {
      const { apiCallFormData } = await import("../service/api.js");

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "imageFiles" && formData.imageFiles?.length > 0) {
          formData.imageFiles.forEach((file) => formDataToSend.append("images", file));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (formData.date) {
        formDataToSend.append("year", new Date(formData.date).getFullYear());
      }

      const url =
        modalMode === "add"
          ? "http://127.0.0.1:8000/api/climate/event/add"
          : `http://127.0.0.1:8000/api/climate/event/${currentEvent.event_id}`;

      const { success, error } = await apiCallFormData(url, formDataToSend);

      if (success) {
        setMessage(modalMode === "add" ? "✅ Event created successfully!" : "✅ Event updated successfully!");
        setMessageType("success");
        fetchEvents();
        handleClose();
      } else {
        setMessage(`❌ Error: ${error}`);
        setMessageType("error");
      }
    } catch (error) {
      setMessage(`❌ Unexpected error: ${error.message}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Event actions
  const handleApprove = async (eventId) => {
    setLoading(true);
    const { success } = await apiCall(
      `http://127.0.0.1:8000/api/climate/event/${eventId}/approve`,
      { method: "PATCH" }
    );

    if (success) {
      setMessage("✅ Event approved!");
      setMessageType("success");
      fetchEvents();
    } else setMessage("❌ Failed to approve");

    setLoading(false);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;

    setLoading(true);
    const { success } = await apiCall(
      `http://127.0.0.1:8000/api/climate/event/${eventId}`,
      { method: "DELETE" }
    );

    if (success) {
      setMessage("🗑 Event deleted!");
      setMessageType("success");
      fetchEvents();
    } else setMessage("❌ Failed to delete");

    setLoading(false);
  };

  const handleToggleFeatured = async (eventId, isFeatured) => {
    setLoading(true);
    const { success } = await apiCall(
      `http://127.0.0.1:8000/api/climate/event/${eventId}/feature`,
      {
        method: "PATCH",
        body: JSON.stringify({ is_featured: isFeatured }),
      }
    );

    if (success) {
      setMessage(isFeatured ? "⭐ Marked Featured" : "❌ Removed Featured");
      setMessageType("success");
      fetchEvents();
    } else setMessage("❌ Failed to update");

    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const map = {
      0: { text: "Approved", variant: "success" },
      1: { text: "Approved", variant: "success" },
      2: { text: "Deleted", variant: "danger" },
      3: { text: "Pending", variant: "warning" },
    };
    const item = map[status] || { text: "Unknown", variant: "secondary" };
    return <Badge bg={item.variant}>{item.text}</Badge>;
  };

  return (
    <div className="admin-page">
      <Container className="admin-main">

        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Card className="admin-card text-center p-4">
              <h1>Events Management</h1>
              <Button className="login-btn mt-2" onClick={() => handleShowModal("add")}>
                <FaPlus /> Add Event
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Messages */}
        {message && (
          <Alert variant={messageType === "success" ? "success" : "danger"}>
            {message}
          </Alert>
        )}

        {/* Filters */}
        <Row className="mb-3">
          <Col md={3}>
            <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="3">Pending</option>
              <option value="1">Approved</option>
              <option value="2">Deleted</option>
            </select>
          </Col>

          <Col md={3}>
            <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
             {categories.map((cat) => (
  <option key={cat.category_id} value={cat.title}>{cat.title}</option>
))}

            </select>
          </Col>

          <Col md={3}>
            <select className="form-select" value={filterFeatured} onChange={(e) => setFilterFeatured(e.target.value)}>
              <option value="">All</option>
              <option value="featured">Featured</option>
              <option value="not_featured">Not Featured</option>
            </select>
          </Col>

          <Col md={3}>
            <select className="form-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </Col>
        </Row>

        {/* Events Table */}
        <Card className="admin-card p-3">
          <h5>Events ({filteredEvents.length})</h5>

          {loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : paginatedEvents.length === 0 ? (
            <p className="text-center">No events found.</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEvents.map((event) => (
                      <tr key={event.event_id}>
                        <td>
                          <strong>{event.title}</strong>
                          <br />
                          <small>{event.description?.slice(0, 80)}...</small>
                        </td>
                        <td>
                          <Badge bg="info">{event.category_name}</Badge>
                        </td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>{getStatusBadge(event.status)}</td>
                        <td>
                          {event.is_featured ? (
                            <Badge bg="warning"><FaStar /> Featured</Badge>
                          ) : "No"}
                        </td>
                        <td>
                          <div className="btn-group">
                            <Button size="sm" variant="outline-primary" onClick={() => handleShowView(event)}>
                              <FaEye />
                            </Button>
                            <Button size="sm" variant="outline-secondary" onClick={() => handleShowModal("edit", event)}>
                              <FaEdit />
                            </Button>
                            {event.status === 3 && (
                              <Button size="sm" variant="outline-success" onClick={() => handleApprove(event.event_id)}>
                                <FaCheck />
                              </Button>
                            )}
                            <Button size="sm" variant="outline-warning" onClick={() => handleToggleFeatured(event.event_id, !event.is_featured)}>
                              <FaStar />
                            </Button>
                            <Button size="sm" variant="outline-danger" onClick={() => handleDelete(event.event_id)}>
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
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
            </>
          )}
        </Card>
      </Container>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === "add" ? "Add Event" : "Edit Event"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm
            initialData={currentEvent}
            onSubmit={handleFormSubmit}
            loading={loading}
            mode={modalMode}
            showUserFields={false}
            showAdminFields={true}
            submitText={modalMode === "add" ? "Add Event" : "Update Event"}
            cancelText="Cancel"
            onCancel={handleClose}
          />
        </Modal.Body>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body> ...same view content... </Modal.Body>
      </Modal>
    </div>
  );
};

export default Events;
