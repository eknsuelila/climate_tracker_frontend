import React, { useState } from "react";
import "./event.css";

const Event = () => {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
    category: "",
    severity: "",
    sourceLink: "",
    description: "",
    impact: "",
    organizer: "",
    email: "",
    imageURL: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🌎 New Event Submitted:", eventData);
    alert("✅ Event submitted successfully! Check console for details.");
    setEventData({
      title: "",
      date: "",
      location: "",
      category: "",
      severity: "",
      sourceLink: "",
      description: "",
      impact: "",
      organizer: "",
      email: "",
      imageURL: "",
    });
  };

  return (
    <div className="event-page">
      <div className="event-card">
        <h2 className="event-title">Submit a Climate Event</h2>
        <p className="event-subtext">
          Share a story that captures the impact of climate change in British Columbia.
          Provide as much detail as possible to help our community understand the event’s
          significance.
        </p>

        <form className="event-form" onSubmit={handleSubmit}>
          {/* Event Basic Info */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                placeholder="e.g., 2021 Lytton Heatwave"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Location & Category */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                placeholder="e.g., Lytton, BC"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={eventData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Wildfire">Wildfire</option>
                <option value="Flood">Flood</option>
                <option value="Heatwave">Heatwave</option>
                <option value="Oil Spill">Oil Spill</option>
                <option value="Landslide">Landslide</option>
                <option value="Drought">Drought</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Severity & Source */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="severity">Severity Level</label>
              <select
                id="severity"
                name="severity"
                value={eventData.severity}
                onChange={handleChange}
              >
                <option value="">Select Severity</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Severe">Severe</option>
                <option value="Catastrophic">Catastrophic</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sourceLink">Source / Reference Link</label>
              <input
                type="url"
                id="sourceLink"
                name="sourceLink"
                value={eventData.sourceLink}
                onChange={handleChange}
                placeholder="e.g., https://www.cbc.ca/news/climate-event"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label htmlFor="description">Event Description</label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe what happened, its causes, and context..."
              required
            />
          </div>

          {/* Impact */}
          <div className="form-group full-width">
            <label htmlFor="impact">Impact Summary</label>
            <textarea
              id="impact"
              name="impact"
              value={eventData.impact}
              onChange={handleChange}
              rows="4"
              placeholder="Discuss how this event affected people, wildlife, or the environment."
            />
          </div>

          {/* Organizer Info */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="organizer">Submitted By</label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={eventData.organizer}
                onChange={handleChange}
                placeholder="Your Name or Organization"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Contact Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={eventData.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Image */}
          <div className="form-group full-width">
            <label htmlFor="imageURL">Event Image (Optional)</label>
            <input
              type="url"
              id="imageURL"
              name="imageURL"
              value={eventData.imageURL}
              onChange={handleChange}
              placeholder="Paste image URL (e.g., from news source)"
            />
          </div>

          <button type="submit" className="submit-btn">
            🌿 Submit Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default Event;
