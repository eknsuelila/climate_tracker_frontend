// src/timeline/timeline.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './timeline.css';

const MotionDiv = motion.div;

// Mock Data (Sorted oldest to newest)
const mockData = [
  {
    _id: '4',
    date: '2008-07-01T00:00:00.000Z',
    title: 'BC Carbon Tax Implemented',
    description: 'BC implemented North Americas first broad-based carbon tax, a landmark policy to reduce emissions.',
    source: 'https://www2.gov.bc.ca/gov/content/environment/climate-change/clean-economy/carbon-tax',
    category: 'Policy',
    imageUrl: 'https://www-origin.goc.ca/sites/default/files/images/2022/03/carbon-pricing-works.jpg'
  },
  {
    _id: '3',
    date: '2021-06-29T00:00:00.000Z',
    title: 'The 2021 Heat Dome',
    description: 'A "heat dome" led to Canada\'s highest-ever recorded temperature (49.6°C) in Lytton.',
    source: 'https://www.cbc.ca/news/canada/british-columbia/lytton-b-c-wildfire-1.6087268',
    category: 'Heatwave',
    imageUrl: 'https://www.vmcdn.ca/f/files/via/import/2022/06/heat-dome-2021-bc-june.jpg;w=960'
  },
  {
    _id: '2',
    date: '2021-11-15T00:00:00.000Z',
    title: '2021 Atmospheric River Floods',
    description: 'A powerful "atmospheric river" caused catastrophic flooding and landslides, submerging the Sumas Prairie.',
    source: 'https://www.thecanadianencyclopedia.ca/en/article/2021-british-columbia-floods',
    category: 'Flood',
    imageUrl: 'https://media.socastsrm.com/wordpress/wp-content/blogs.dir/2047/files/2021/11/sumas-prairie-flood-nov-16-2021-bc-ministry-of-transportation-and-infrastructure-twitter-1200x798.jpg'
  },
  {
    _id: '1',
    date: '2023-08-15T00:00:00.000Z',
    title: '2023 Record Wildfire Season',
    description: 'The 2023 wildfire season was the most destructive in BCs history, burning over 28,400 square kilometres.',
    source: 'https://www.cbc.ca/news/canada/british-columbia/b-c-wildfire-season-ends-officially-1.6994112',
    category: 'Wildfire',
    imageUrl: 'https://i.cbc.ca/1.6940003.1692399074!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_780/a-wildfire-burns-in-west-kelowna-b-c-on-aug-17-2023.jpg'
  }
];

const TimelinePage = () => {
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  
  // A ref to the container to set drag boundaries
  const constraintsRef = useRef(null); 

  useEffect(() => {
    // Sort data from oldest to newest for the horizontal bar
    const sortedData = mockData.sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(sortedData);
    
    // Set the most recent event as the default
    if (sortedData.length > 0) {
      setActiveEvent(sortedData[sortedData.length - 1]);
    }
  }, []);

  return (
    <div className="timeline-page-container">
      
      {/* --- TOP PANEL: Event Details --- */}
      <div className="details-panel">
        <AnimatePresence mode="wait">
          {activeEvent && (
            <MotionDiv
              key={activeEvent._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="details-content"
            >
              <h1>{activeEvent.title}</h1>
              <span className="details-category">{activeEvent.category}</span>
              <span className="details-date">{new Date(activeEvent.date).toLocaleDateString()}</span>
              
              <img 
                src={activeEvent.imageUrl} 
                alt={activeEvent.title} 
                className="details-image"
              />
              
              <p className="details-description">{activeEvent.description}</p>
              
              <a 
                href={activeEvent.source} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="details-source"
              >
                Read Full Story
              </a>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>

      {/* --- BOTTOM PANEL: Horizontal Slider/Timeline --- */}
      <div className="timeline-slider-container" ref={constraintsRef}>
        <MotionDiv
          className="timeline-slider-content"
          drag="x" // Enable horizontal dragging
          dragConstraints={constraintsRef} // Constrain dragging to the parent
        >
          {/* This is the horizontal bar */}
          <div className="timeline-bar"></div>
          
          {/* Map over the events */}
          {events.map((event) => (
            <div
              className={`timeline-item ${activeEvent?._id === event._id ? 'timeline-item-active' : ''}`}
              key={event._id}
              onClick={() => setActiveEvent(event)}
            >
              {/* This is the order you wanted */}
              <div className="timeline-dot"></div>
              <div className="timeline-item-content">
                <div className="item-year">{new Date(event.date).getFullYear()}</div>
                <div className="item-title">{event.title}</div>
                {/* Add the category here */}
                <div className="item-category">{event.category}</div>
              </div>
            </div>
          ))}
        </MotionDiv>
      </div>
    </div>
  );
};

export default TimelinePage;