import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { API_ENDPOINTS, apiCall, apiCallFormData, publicApiCall } from '../service/api.js';

const EventForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false, 
  mode = 'create', // 'create' or 'edit'
  showAdminFields = false, // Show admin-only fields
  showUserFields = true,   // Show user-specific fields
  submitText = 'Submit Event',
  cancelText = 'Cancel'
}) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    category_id: "",
    severity: "",
    sourceLink: "",
    description: "",
    impact: "",
    organizer: "",
    email: "",
    imageFiles: null,
    // Admin fields
    is_featured: false,
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, success, error } = await publicApiCall(API_ENDPOINTS.CATEGORIES);
      if (success) {
        setCategories(data);
      } else {
        console.error('Failed to fetch categories:', error);
        setMessage(`Failed to load categories: ${error}`);
        setMessageType("error");
      }
    };
    
    fetchCategories();
  }, []);

  // Load initial data for edit mode
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title || "",
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
        location: initialData.location || "",
        category_id: initialData.category_id || "",
        severity: initialData.severity || "",
        sourceLink: initialData.source || "",
        description: initialData.description || "",
        impact: initialData.impact || "",
        organizer: initialData.organizer || "",
        email: initialData.email || "",
        imageFiles: null,
        is_featured: initialData.is_featured || false,
      });
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      imageFiles: e.target.files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);

    try {
      if (onSubmit) {
        // Use custom submit handler if provided
        await onSubmit(formData);
      } else {
        // Default submit behavior - only send backend-required fields
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('source', formData.sourceLink || '');
        
        if (showAdminFields) {
          formDataToSend.append('is_featured', formData.is_featured);
        }

        // Add image files if any
        if (formData.imageFiles && formData.imageFiles.length > 0) {
          for (let i = 0; i < formData.imageFiles.length; i++) {
            formDataToSend.append('images', formData.imageFiles[i]);
          }
        }

        const endpoint = mode === 'edit' && initialData 
          ? `${API_ENDPOINTS.EVENTS}/${initialData.event_id}`
          : `${API_ENDPOINTS.EVENTS}/add`;

        const { data, success, error } = await apiCallFormData(endpoint, formDataToSend);

        if (success) {
          setMessage("✅ Event saved successfully!");
          setMessageType("success");
          // Reset form after successful submission
          if (mode === 'create') {
            setFormData({
              title: "",
              date: "",
              location: "",
              category_id: "",
              severity: "",
              sourceLink: "",
              description: "",
              impact: "",
              organizer: "",
              email: "",
              imageFiles: null,
              is_featured: false,
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
        <Alert variant={messageType === 'success' ? 'success' : 'danger'} className="mb-3">
          {message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Event Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
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

        {/* Location and Category */}
        <Row>
          {showUserFields && (
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Vancouver, BC"
                />
              </Form.Group>
            </Col>
          )}
          <Col md={showUserFields ? 6 : 12}>
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Severity and Source */}
        <Row>
          {showUserFields && (
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Severity Level</Form.Label>
                <Form.Select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                >
                  <option value="">Select Severity</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Severe">Severe</option>
                  <option value="Catastrophic">Catastrophic</option>
                </Form.Select>
              </Form.Group>
            </Col>
          )}
          <Col md={showUserFields ? 6 : 12}>
            <Form.Group className="mb-3">
              <Form.Label>Source / Reference Link</Form.Label>
              <Form.Control
                type="url"
                name="sourceLink"
                value={formData.sourceLink}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Event Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what happened, its causes, and context..."
            required
          />
        </Form.Group>

        {/* Impact (User only) */}
        {showUserFields && (
          <Form.Group className="mb-3">
            <Form.Label>Impact Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="impact"
              value={formData.impact}
              onChange={handleChange}
              placeholder="Discuss how this event affected people, wildlife, or the environment."
            />
          </Form.Group>
        )}

        {/* Organizer Info (User only) */}
        {showUserFields && (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Submitted By</Form.Label>
                <Form.Control
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="Your Name or Organization"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {/* Images */}
        <Form.Group className="mb-3">
          <Form.Label>Event Images (Optional)</Form.Label>
          <Form.Control
            type="file"
            name="imageFiles"
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
          <Form.Text>You can select multiple images (max 5)</Form.Text>
        </Form.Group>

        {/* Admin Fields */}
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

        {/* Submit Buttons */}
        <div className="d-flex gap-2">
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : submitText}
          </Button>
          {onCancel && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default EventForm;
