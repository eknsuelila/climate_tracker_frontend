import React, { useState } from "react";
import "./contacts.css";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../service/api.js";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const now = new Date().toISOString();

      const res = await fetch(API_ENDPOINTS.CONTACT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: false,
          created_at: now,
          updated_at: now,
          is_deleted: false,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to send message");
        return;
      }

      const data = await res.json();
      if (import.meta.env.DEV) {
        console.log("Response:", data);
      }

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (err) {
      if (import.meta.env.DEV) {
        console.error(err);
      }
      toast.error("Something went wrong 😢");
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-card">
        <h2 className="text-center mb-2">Contact Us</h2>
        <p className="text-center mb-4 small-text">
          We'd love to hear from you.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter subject"
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="Write your message..."
            ></textarea>
          </div>

          <button type="submit" className="contact-btn w-100">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contacts;
