import React from 'react';
import './timeline.css';

const TimelinePage = () => {
  const events = [
    {
      id: 1,
      title: "Wildfire in BC",
      description: "Severe wildfire impacted large areas of forest and communities.",
      date: "July 15, 2025"
    },
    {
      id: 2,
      title: "Flooding in Vancouver",
      description: "Heavy rains caused flooding in several neighborhoods.",
      date: "August 3, 2025"
    },
    {
      id: 3,
      title: "Heatwave Hits BC",
      description: "Temperatures reached record highs across the province.",
      date: "September 10, 2025"
    }
  ];

  return (
    <div className="timeline-page">
      <h1>Climate Events Timeline</h1>
      <div className="timeline-container">
        {events.map(event => (
          <div className="timeline-event" key={event.id}>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p className="event-date">{event.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelinePage;
