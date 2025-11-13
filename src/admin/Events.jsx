import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Badge, Alert } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaStar } from "react-icons/fa";
import { API_ENDPOINTS, apiCall, publicApiCall } from "../service/api.js";
import EventForm from "../components/EventForm.jsx";
import "./admin.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  
  // Form submission handler
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setMessage(null);

    try {
      const { API_ENDPOINTS, apiCallFormData } = await import("../service/api.js");
      
      if (modalMode === 'add') {
        // Create FormData for new event - admin form only has backend fields
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('source', formData.source || '');
        formDataToSend.append('is_featured', formData.is_featured);
        // Required: severity
        formDataToSend.append('severity', formData.severity || '');
        
        // Auto-calculate year from date
        if (formData.date) {
          const year = new Date(formData.date).getFullYear();
          formDataToSend.append('year', year);
        }
        
        // Send location, impact_summary, and contact_email
        formDataToSend.append('location', formData.location || '');
        formDataToSend.append('impact_summary', formData.impact_summary || '');
        formDataToSend.append('contact_email', formData.contact_email || '');
        formDataToSend.append('region', formData.region || '');
        formDataToSend.append('type', formData.type || '');

        // Add image files if any
        if (formData.imageFiles && formData.imageFiles.length > 0) {
          for (let i = 0; i < formData.imageFiles.length; i++) {
            formDataToSend.append('images', formData.imageFiles[i]);
          }
        }

        const { data, success, error } = await apiCallFormData(
          'http://127.0.0.1:8000/api/climate/event/add',
          formDataToSend
        );

        if (success) {
          setMessage("✅ Event created successfully!");
          setMessageType("success");
          fetchEvents();
          handleClose();
        } else {
          setMessage(`❌ Failed to create event: ${error}`);
          setMessageType("error");
        }
      } else if (modalMode === 'edit' && currentEvent) {
        // Update existing event - admin form only has backend fields
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('source', formData.source || '');
        formDataToSend.append('is_featured', formData.is_featured);
        // Required: severity
        formDataToSend.append('severity', formData.severity || '');
        
        // Auto-calculate year from date
        if (formData.date) {
          const year = new Date(formData.date).getFullYear();
          formDataToSend.append('year', year);
        }
        
        // Send location, impact_summary, and contact_email
        formDataToSend.append('location', formData.location || '');
        formDataToSend.append('impact_summary', formData.impact_summary || '');
        formDataToSend.append('contact_email', formData.contact_email || '');
        formDataToSend.append('region', formData.region || '');
        formDataToSend.append('type', formData.type || '');

        // Add image files if any
        if (formData.imageFiles && formData.imageFiles.length > 0) {
          for (let i = 0; i < formData.imageFiles.length; i++) {
            formDataToSend.append('images', formData.imageFiles[i]);
          }
        }

        const { data, success, error } = await apiCallFormData(
          `http://127.0.0.1:8000/api/climate/event/${currentEvent.event_id}`,
          formDataToSend,
          { method: 'POST' }
        );

        if (success) {
          setMessage("✅ Event updated successfully!");
          setMessageType("success");
          fetchEvents();
          handleClose();
        } else {
          setMessage(`❌ Failed to update event: ${error}`);
          setMessageType("error");
        }
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Load events and categories on component mount
  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  // Fetch events from backend
  const fetchEvents = async () => {
    setLoading(true);
    const { data, success, error } = await apiCall(API_ENDPOINTS.EVENTS);
    
    if (success) {
      setEvents(data);
    } else {
      setMessage(`Failed to load events: ${error}`);
      setMessageType("error");
    }
    setLoading(false);
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    const { data, success, error } = await publicApiCall(API_ENDPOINTS.CATEGORIES);
    
    if (success) {
      setCategories(data);
    } else {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setShowModal(false);
    setShowViewModal(false);
    setCurrentEvent(null);
    setModalMode('add');
  };

  // Show modal for add/edit
  const handleShowModal = (mode, event = null) => {
    setModalMode(mode);
    setCurrentEvent(event);
    setShowModal(true);
  };

  // Show view modal
  const handleShowView = (event) => {
    setCurrentEvent(event);
    setShowViewModal(true);
  };

  // Approve event
  const handleApprove = async (eventId) => {
    setLoading(true);
    const { data, success, error } = await apiCall(`http://127.0.0.1:8000/api/climate/event/${eventId}/approve`, {
      method: 'PATCH'
    });

    if (success) {
      setMessage("✅ Event approved successfully!");
      setMessageType("success");
      fetchEvents(); // Refresh events list
    } else {
      setMessage(`❌ Failed to approve event: ${error}`);
      setMessageType("error");
    }
    setLoading(false);
  };

  // Delete event (soft delete)
  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setLoading(true);
      const { data, success, error } = await apiCall(`http://127.0.0.1:8000/api/climate/event/${eventId}`, {
        method: 'DELETE'
      });

      if (success) {
        setMessage("✅ Event deleted successfully!");
        setMessageType("success");
        fetchEvents(); // Refresh events list
      } else {
        setMessage(`❌ Failed to delete event: ${error}`);
        setMessageType("error");
      }
      setLoading(false);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (eventId, isFeatured) => {
    setLoading(true);
    const { data, success, error } = await apiCall(`http://127.0.0.1:8000/api/climate/event/${eventId}/feature`, {
      method: 'PATCH',
      body: JSON.stringify({ is_featured: isFeatured })
    });

    if (success) {
      setMessage(`✅ Event ${isFeatured ? 'featured' : 'unfeatured'} successfully!`);
      setMessageType("success");
      fetchEvents(); // Refresh events list
    } else {
      setMessage(`❌ Failed to update featured status: ${error}`);
      setMessageType("error");
    }
    setLoading(false);
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      0: { text: 'Approved', variant: 'success' },
      1: { text: 'Approved', variant: 'success' },
      2: { text: 'Deleted', variant: 'danger' },
      3: { text: 'Pending', variant: 'warning' }
    };
    const statusInfo = statusMap[status] || { text: 'Unknown', variant: 'secondary' };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  return (
    <div className="admin-page">
      <Container className="admin-main">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Card className="admin-card text-center p-4">
              <Card.Body>
                <h1>Events Management</h1>
                <p>Manage climate events, approve submissions, and control featured content.</p>
                <Button 
                  className="login-btn mt-2" 
                  onClick={() => handleShowModal('add')}
                  disabled={loading}
                >
                  <FaPlus /> Add New Event
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Messages */}
        {message && (
          <Row className="mb-3">
            <Col>
              <Alert variant={messageType === 'success' ? 'success' : 'danger'}>
                {message}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Events List */}
        <Row>
          <Col>
            <Card className="admin-card">
              <Card.Header>
                <h5>All Events ({events.length})</h5>
              </Card.Header>
                <Card.Body>
                {loading ? (
                  <div className="text-center p-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center p-4">
                    <p>No events found.</p>
                  </div>
                ) : (
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
                        {events.map((event) => (
                          <tr key={event.event_id}>
                            <td>
                              <strong>{event.title}</strong>
                              <br />
                              <small className="text-muted">
                                {event.description?.substring(0, 100)}...
                              </small>
                            </td>
                            <td>
                              <Badge bg="info">{event.category_name}</Badge>
                            </td>
                            <td>
                              {new Date(event.date).toLocaleDateString()}
                            </td>
                            <td>
                              {getStatusBadge(event.status)}
                            </td>
                            <td>
                              {event.is_featured ? (
                                <Badge bg="warning">
                                  <FaStar /> Featured
                                </Badge>
                              ) : (
                                <span className="text-muted">No</span>
                              )}
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleShowView(event)}
                                  title="View Details"
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  onClick={() => handleShowModal('edit', event)}
                                  title="Edit Event"
                                >
                                  <FaEdit />
                                </Button>
                                {event.status === 3 && (
                                  <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => handleApprove(event.event_id)}
                                    title="Approve Event"
                                  >
                                    <FaCheck />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline-warning"
                                  onClick={() => handleToggleFeatured(
                                    event.event_id, 
                                    !event.is_featured
                                  )}
                                  title={event.is_featured ? "Remove from Featured" : "Make Featured"}
                                >
                                  <FaStar />
                  </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDelete(event.event_id)}
                                  title="Delete Event"
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Add New Event' : 'Edit Event'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm
            initialData={currentEvent}
            onSubmit={handleFormSubmit}
            loading={loading}
            mode={modalMode}
            showUserFields={false}
            showAdminFields={true}
            submitText={modalMode === 'add' ? 'Add Event' : 'Update Event'}
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
        <Modal.Body>
          {currentEvent && (
            <div>
              <Row className="mb-3">
                <Col>
                  <h4>{currentEvent.title}</h4>
                  <div className="d-flex gap-2 mb-2">
                    {getStatusBadge(currentEvent.status)}
                    {currentEvent.is_featured && (
                      <Badge bg="warning">
                        <FaStar /> Featured
                      </Badge>
                    )}
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Category:</strong> {currentEvent.category_name}
                </Col>
                <Col md={6}>
                  <strong>Date:</strong> {new Date(currentEvent.date).toLocaleDateString()}
                </Col>
              </Row>

              {currentEvent.location && (
                <Row className="mb-3">
                  <Col>
                    <strong>Location:</strong> {currentEvent.location}
                  </Col>
                </Row>
              )}

              {currentEvent.year && (
                <Row className="mb-3">
                  <Col>
                    <strong>Year:</strong> {currentEvent.year}
                  </Col>
                </Row>
              )}

              {currentEvent.impact_summary && (
                <Row className="mb-3">
                  <Col>
                    <strong>Impact Summary:</strong>
                    <p className="mt-2">{currentEvent.impact_summary}</p>
                  </Col>
                </Row>
              )}

              {currentEvent.contact_email && (
                <Row className="mb-3">
                  <Col>
                    <strong>Contact Email:</strong> {currentEvent.contact_email}
                  </Col>
                </Row>
              )}

              {currentEvent.source && (
                <Row className="mb-3">
                  <Col>
                    <strong>Source:</strong> 
                    <a href={currentEvent.source} target="_blank" rel="noopener noreferrer" className="ms-2">
                      {currentEvent.source}
                    </a>
                  </Col>
                </Row>
              )}

              <Row className="mb-3">
                <Col>
                  <strong>Description:</strong>
                  <p className="mt-2">{currentEvent.description}</p>
                </Col>
              </Row>

              {currentEvent.image_urls && currentEvent.image_urls.length > 0 && (
                <Row className="mb-3">
                  <Col>
                    <strong>Images:</strong>
                    <div className="mt-2">
                      {currentEvent.image_urls.map((url, index) => (
                        <img
                          key={index}
                          src={`http://127.0.0.1:8000${url}`}
                          alt={`Event image ${index + 1}`}
                          className="img-thumbnail me-2"
                          style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                      ))}
                    </div>
                  </Col>
                </Row>
              )}

              {currentEvent.uploaded_by_user && (
                <Row className="mb-3">
                  <Col>
                    <strong>Uploaded by:</strong> {currentEvent.uploaded_by_user}
                  </Col>
                </Row>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Events;
