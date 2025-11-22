import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { API_ENDPOINTS, apiCallFormData } from "../service/api.js";
import { useCategoriesCached } from "../hooks/useCategoriesCached.js";

const EventForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  showAdminFields = false,
  showUserFields = true,
  submitText = "Submit Event",
  cancelText = "Cancel",
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    date: "",
    location: "",
    impact_summary: "",
    contact_email: "",
    severity: "",
    region: "",
    type: "",
    source: "",
    is_featured: false,
    imageFiles: null,
  });

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  // Fetch categories using cached hook
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategoriesCached();

  // Set error message if categories fail to load
  useEffect(() => {
    if (categoriesError) {
      setMessage(`Failed to load categories: ${categoriesError}`);
      setMessageType("error");
    }
  }, [categoriesError]);

  // Populate data if editing
  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        category_id: initialData.category_id || "",
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : "",
        location: initialData.location || "",
        impact_summary: initialData.impact_summary || "",
        contact_email: initialData.contact_email || "",
        severity: initialData.severity || "",
        region: initialData.region || "",
        type: initialData.type || "",
        source: initialData.source || "",
        is_featured: initialData.is_featured || false,
        imageFiles: null,
      });
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      imageFiles: e.target.files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("category_id", formData.category_id);
        formDataToSend.append("date", formData.date);
        // Auto-calculate year from date
        if (formData.date) {
          const year = new Date(formData.date).getFullYear();
          formDataToSend.append("year", year);
        }
        formDataToSend.append("location", formData.location);
        formDataToSend.append("impact_summary", formData.impact_summary);
        formDataToSend.append("contact_email", formData.contact_email);
        formDataToSend.append("severity", formData.severity);
        formDataToSend.append("region", formData.region);
        formDataToSend.append("type", formData.type);
        formDataToSend.append("source", formData.source || "");
        formDataToSend.append("is_featured", formData.is_featured);

        if (formData.imageFiles && formData.imageFiles.length > 0) {
          for (let i = 0; i < formData.imageFiles.length; i++) {
            formDataToSend.append("images", formData.imageFiles[i]);
          }
        }

        const endpoint =
          mode === "edit" && initialData
            ? `${API_ENDPOINTS.EVENTS}/${initialData.event_id}`
            : `${API_ENDPOINTS.EVENTS}/add`;

        const { success, error } = await apiCallFormData(endpoint, formDataToSend);

        if (success) {
          setMessage("✅ Event saved successfully!");
          setMessageType("success");
          if (mode === "create") {
            setFormData({
              title: "",
              description: "",
              category_id: "",
              date: "",
              location: "",
              impact_summary: "",
              contact_email: "",
              severity: "",
              region: "",
              type: "",
              source: "",
              is_featured: false,
              imageFiles: null,
            });
          }
        } else {
          setMessage(`❌ Failed to save event: ${error}`);
          setMessageType("error");
        }
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType("error");
    }
  };

  return (
    <div>
      {message && (
        <Alert
          variant={messageType === "success" ? "success" : "danger"}
          className="mb-3"
        >
          {message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Event Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Date *</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Location *</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Impact Summary *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="impact_summary"
            value={formData.impact_summary}
            onChange={handleChange}
            placeholder="Describe the event's impact..."
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Severity *</Form.Label>
              <Form.Select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                required
              >
                <option value="">Select Severity</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Severe">Severe</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Region *</Form.Label>
              <Form.Select
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
              >
                <option value="">Select Region</option>
                <option value="Northern BC">Northern BC</option>
                <option value="Thompson-Okanagan">Thompson-Okanagan</option>
                <option value="Lower Mainland">Lower Mainland</option>
                <option value="Vancouver Island & Coast">Vancouver Island & Coast</option>
                <option value="Kootenay/Columbia">Kootenay/Columbia</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Event Type *</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="minor">Minor</option>
                <option value="major">Major</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contact Email *</Form.Label>
              <Form.Control
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Source</Form.Label>
              <Form.Control
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Optional - e.g., News article, Government report, etc."
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Upload Images (max 5)</Form.Label>
          <Form.Control
            type="file"
            name="imageFiles"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        {showAdminFields && (
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              label="Featured Event"
            />
          </Form.Group>
        )}

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving..." : submitText}
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default EventForm;
