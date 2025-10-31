import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm.jsx";
import "./event.css";

const Event = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);

      // Description stays as user-entered description
      formDataToSend.append('description', formData.description);

      // Required backend fields sent separately
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('date', formData.date);

      // Auto-calculate year from date
      if (formData.date) {
        const year = new Date(formData.date).getFullYear();
        formDataToSend.append('year', year);
      }

      // New required fields
      formDataToSend.append('location', formData.location || '');
      formDataToSend.append('impact_summary', formData.impact_summary || '');
      formDataToSend.append('contact_email', formData.contact_email || '');
      formDataToSend.append('severity', formData.severity || '');

      // Optional fields
      formDataToSend.append('source', formData.source || '');
      formDataToSend.append('is_featured', 'false');

      // Add image files if any
      if (formData.imageFiles && formData.imageFiles.length > 0) {
        for (let i = 0; i < formData.imageFiles.length; i++) {
          formDataToSend.append('images', formData.imageFiles[i]);
        }
      }

      const { API_ENDPOINTS, apiCallFormData } = await import("../service/api.js");
      const { data, success, error } = await apiCallFormData(
        `${API_ENDPOINTS.EVENTS}add`,
        formDataToSend
      );

      if (success) {
        setMessage("✅ Event submitted successfully! It will be reviewed by administrators.");
        setMessageType("success");
        // Redirect to home after successful submission
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(`❌ Failed to submit event: ${error}`);
        setMessageType("error");
      }
    } catch (error) {
      setMessage(`❌ Error submitting event: ${error.message}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-page">
      <div className="event-card">
        <h2 className="event-title">Submit a Climate Event</h2>
        <p className="event-subtext">
          Share a story that captures the impact of climate change in British Columbia.
          Provide as much detail as possible to help our community understand the event's
          significance.
        </p>

        {message && (
          <div className={`event-message ${messageType || ""}`}>
            <div className="event-message-inner">
              <div className="event-message-icon" aria-hidden="true">
                {messageType === "success" ? "✅" : "⚠️"}
              </div>
              <div className="event-message-content">
                <div className="event-message-title">
                  {messageType === "success" ? "Success" : "Notice"}
                </div>
                <div className="event-message-body">{message}</div>
              </div>
            </div>
          </div>
        )}

        <EventForm
          onSubmit={handleSubmit}
          loading={loading}
          mode="create"
          showUserFields={true}
          showAdminFields={false}
          submitText="🌿 Submit Event"
        />
      </div>
    </div>
  );
};

export default Event;
