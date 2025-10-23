import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./admin.css";

const Events = () => {
  const [events, setEvents] = useState([
    { id: 1, name: "Wildfire in BC", date: "2025-09-10" },
    { id: 2, name: "Flood in Ontario", date: "2025-08-20" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ name: "", date: "" });
  const [editId, setEditId] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setCurrentEvent({ name: "", date: "" });
    setEditId(null);
  };

  const handleShow = (event = { name: "", date: "" }, id = null) => {
    setCurrentEvent(event);
    setEditId(id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editId) {
      setEvents(events.map(ev => (ev.id === editId ? { ...ev, ...currentEvent } : ev)));
    } else {
      const newId = events.length ? events[events.length - 1].id + 1 : 1;
      setEvents([...events, { id: newId, ...currentEvent }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  return (
    <div className="admin-page">
      <Container className="admin-main">
        <Row className="mb-4">
          <Col>
            <Card className="admin-card text-center p-4">
              <Card.Body>
                <h1>Events Management</h1>
                <p>Add, edit, or delete events below.</p>
                <Button className="login-btn mt-2" onClick={() => handleShow()}>
                  <FaPlus /> Add New Event
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row xs={1} md={3} className="g-4">
          {events.map((ev) => (
            <Col key={ev.id}>
              <Card className="admin-card text-center">
                <Card.Body>
                  <h5>{ev.name}</h5>
                  <p>{ev.date}</p>
                  <Button className="login-btn me-2" onClick={() => handleShow(ev, ev.id)}>
                    <FaEdit /> Edit
                  </Button>
                  <Button className="login-btn" onClick={() => handleDelete(ev.id)}>
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
          <Modal.Title>{editId ? "Edit Event" : "Add New Event"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventName" className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event name"
                value={currentEvent.name}
                onChange={(e) => setCurrentEvent({ ...currentEvent, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="eventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={currentEvent.date}
                onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
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

export default Events;
