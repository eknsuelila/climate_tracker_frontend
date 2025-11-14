import React from "react";
import "./contacts.css";

const Contacts = () => {
  return (
    <div className="contact-page">
      <div className="contact-card">
        <h2 className="text-center mb-2">Contact Us</h2>
        <p className="text-center mb-4 small-text">
          We'd love to hear from you.
        </p>

        <form>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter subject"
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
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
