import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Badge,
  Form,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import "./admin.css";

const Region = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit
  const [currentRegion, setCurrentRegion] = useState({
    name: "",
    description: "",
    status: 1,
  });
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Fetch all regions on mount
  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    setLoading(true);
    const { data, success, error } = await apiCall(API_ENDPOINTS.REGIONS);
    if (success) {
      setRegions(data);
    } else {
      toast.error(`❌ Failed to fetch regions: ${error}`);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRegion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let endpoint, method, body;

      if (modalMode === "add") {
        endpoint = `${API_ENDPOINTS.REGIONS}/add`;
        method = "POST";
        body = JSON.stringify(currentRegion);
      } else if (modalMode === "edit" && selectedRegion) {
        endpoint = `${API_ENDPOINTS.REGIONS}/${selectedRegion.region_id}`;
        method = "PUT";
        body = JSON.stringify(currentRegion);
      }

      const { success, error } = await apiCall(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (success) {
        toast.success(
          modalMode === "add"
            ? "✅ Region added successfully!"
            : "✅ Region updated successfully!"
        );
        fetchRegions();
        handleClose();
      } else {
        toast.error(`❌ Failed to save region: ${error}`);
      }
    } catch (error) {
      toast.error(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (regionId) => {
    if (window.confirm("Are you sure you want to deactivate this region?")) {
      setLoading(true);
      const { success, error } = await apiCall(
        `${API_ENDPOINTS.REGIONS}/${regionId}`,
        {
          method: "DELETE",
        }
      );

      if (success) {
        toast.success("✅ Region deactivated successfully!");
        fetchRegions();
      } else {
        toast.error(`❌ Failed to delete region: ${error}`);
      }
      setLoading(false);
    }
  };

  const handleShow = (mode, region = null) => {
    setModalMode(mode);
    if (mode === "edit" && region) {
      setSelectedRegion(region);
      setCurrentRegion({
        name: region.name,
        description: region.description,
        status: region.status,
      });
    } else {
      setCurrentRegion({ name: "", description: "", status: 1 });
      setSelectedRegion(null);
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentRegion({ name: "", description: "", status: 1 });
    setSelectedRegion(null);
  };

  const getStatusBadge = (status) => {
    if (status === 1) return <Badge bg="success">Active</Badge>;
    if (status === 2) return <Badge bg="danger">Deactivated</Badge>;
    return <Badge bg="secondary">Unknown</Badge>;
  };

  return (
    <div className="admin-page">
      <Container className="admin-main">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Card className="admin-card text-center p-4">
              <Card.Body>
                <h1>Region Management</h1>
                <p>Manage geographical regions — add, edit, or deactivate.</p>
                <Button
                  className="login-btn mt-2"
                  onClick={() => handleShow("add")}
                  disabled={loading}
                >
                  <FaPlus /> Add New Region
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Row>
          <Col>
            <Card className="admin-card">
              <Card.Header>
                <h5>All Regions ({regions.length})</h5>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center p-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : regions.length === 0 ? (
                  <div className="text-center p-4">
                    <p>No regions found.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regions.map((region) => (
                          <tr key={region.region_id}>
                            <td>
                              <strong>{region.name}</strong>
                            </td>
                            <td>{region.description}</td>
                            <td>{getStatusBadge(region.status)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  onClick={() => handleShow("edit", region)}
                                  title="Edit"
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant={
                                    region.status === 2
                                      ? "secondary"
                                      : "outline-danger"
                                  }
                                  onClick={() => handleDelete(region.region_id)}
                                  title={
                                    region.status === 2
                                      ? "Already deactivated"
                                      : "Deactivate"
                                  }
                                  disabled={region.status === 2} // 🚫 Disable if deactivated
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

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add New Region" : "Edit Region"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Region Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentRegion.name}
                onChange={handleChange}
                placeholder="Enter region name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={currentRegion.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={currentRegion.status}
                onChange={handleChange}
              >
                <option value={1}>Active</option>
                <option value={2}>Deactivated</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="login-btn" onClick={handleSave} disabled={loading}>
            {modalMode === "add" ? "Add Region" : "Update Region"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default Region;
