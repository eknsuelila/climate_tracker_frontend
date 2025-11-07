import React, { useEffect, useState } from "react";
import "./AboutUs.css";

export default function AboutUs() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/about") // FastAPI endpoint
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="about-container">
      <header className="about-header">
        <h1>
          About <span className="highlight">Climate Chronicler</span>
        </h1>
        <p className="subtitle">
          Tracking environmental change and community resilience across British
          Columbia.
        </p>
      </header>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Climate Chronicler is a modern climate tracking platform built with
          React and FastAPI. We help visualize and understand how temperature,
          precipitation, air quality, and other environmental indicators change
          across British Columbia. Our goal is to empower citizens, researchers,
          and policy makers with accurate, open climate data.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Track</h2>
        <ul className="info-list">
          <li>🌦️ Temperature and Precipitation Trends</li>
          <li>🔥 Wildfire and Air Quality Data</li>
          <li>🌊 River Levels and Flood Warnings</li>
          <li>🌲 Forest Health and Land Use Change</li>
        </ul>
      </section>

      {/* Removed Technology Stack */}

      {/* Removed Our Impact */}

      <section className="about-section">
        <h2>Land Acknowledgement</h2>
        <p>
          We acknowledge that the data represented on Climate Chronicler spans
          the traditional territories of Indigenous Peoples across British
          Columbia. We are grateful to live and work on these lands, and we aim
          to promote environmental awareness and stewardship.
        </p>
      </section>

      <footer className="about-footer">
        <p>© 2025 Climate Chronicler. All rights reserved.</p>
      </footer>
    </div>
  );
}
