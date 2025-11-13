// src/timeline/timeline.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { apiCall } from '../service/api.js';
import './timeline.css';

const MotionDiv = motion.div;
const API_BASE_URL = 'http://127.0.0.1:8000';

// Slideshow component for event images
const ImageSlideshow = ({ images, eventTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (images.length > 1) {
      // Auto-play slideshow with 4 second intervals
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length]);

  if (images.length === 0) {
    return null;
  }

  const goToSlide = (index) => {
    setCurrentIndex(index);
    // Reset auto-play timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);
    }
  };

  return (
    <div className="slideshow-container">
      <div className="slideshow-wrapper">
        {/* Blurred background image */}
        <div 
          className="slideshow-background"
          style={{
            backgroundImage: `url(${images[currentIndex]})`
          }}
        />
        
        <AnimatePresence mode="wait">
          <MotionDiv
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="slideshow-image-container"
          >
            <img
              src={images[currentIndex]}
              alt={`${eventTitle} - Image ${currentIndex + 1}`}
              className="slideshow-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </MotionDiv>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="slideshow-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`slideshow-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TimelinePage = () => {
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs for position tracking
  const constraintsRef = useRef(null); 
  const sliderContentRef = useRef(null);
  const eventRefs = useRef({});
  
  // Motion value to track drag position
  const x = useMotionValue(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, success, error: apiError } = await apiCall('http://127.0.0.1:8000/api/climate/event/');
      
      if (success && data) {
        // Filter for approved events (status = 1) and map to timeline format
        const approvedEvents = data
          .filter(event => event.status === 1)
          .map(event => {
            // Get all image URLs and randomize them
            // Handle both Cloudinary URLs (full URLs) and local URLs (relative paths)
            const imageUrls = event.image_urls && event.image_urls.length > 0
              ? event.image_urls
                  .map(url => {
                    // If URL is already a full URL (Cloudinary), use it as-is
                    // Otherwise, prepend API base URL for local images
                    return url.startsWith('http://') || url.startsWith('https://')
                      ? url
                      : `${API_BASE_URL}${url}`;
                  })
                  .sort(() => Math.random() - 0.5) // Randomize order
              : [];
            
            return {
              _id: event.event_id,
              date: event.date,
              title: event.title,
              description: event.description,
              source: event.source || '',
              category: event.category_name || 'Uncategorized',
              imageUrls: imageUrls, // Array of all image URLs in random order
              // Additional fields to display
              location: event.location || '',
              impactSummary: event.impact_summary || '',
              contactEmail: event.contact_email || '',
              year: event.year || null,
              uploadedBy: event.uploaded_by_user || event.uploaded_by || '',
              severity: event.severity || '',
              isFeatured: !!event.is_featured
            };
          });
        
    // Sort data from oldest to newest for the horizontal bar
        const sortedData = approvedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(sortedData);
    
    // Set the most recent event as the default
    if (sortedData.length > 0) {
      setActiveEvent(sortedData[sortedData.length - 1]);
    }
      } else {
        setError(apiError || 'Failed to load events');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading events');
    } finally {
      setLoading(false);
    }
  };

  // Function to find the event closest to the center of the viewport
  const findClosestEvent = () => {
    if (!constraintsRef.current || events.length === 0) return null;

    const container = constraintsRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestEvent = null;
    let closestDistance = Infinity;

    events.forEach((event) => {
      const eventElement = eventRefs.current[event._id];
      if (!eventElement) return;

      const eventRect = eventElement.getBoundingClientRect();
      
      // Calculate event center
      const eventCenter = eventRect.left + eventRect.width / 2;
      const distance = Math.abs(eventCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestEvent = event;
      }
    });

    return closestEvent;
  };

  // Handle drag end to snap to nearest event and update active
  const handleDragEnd = () => {
    const closestEvent = findClosestEvent();
    if (closestEvent && (!activeEvent || closestEvent._id !== activeEvent._id)) {
      setActiveEvent(closestEvent);
    }
    
    // Snap to center of closest event
    if (!closestEvent || !constraintsRef.current) return;

    const eventElement = eventRefs.current[closestEvent._id];
    if (!eventElement) return;

    const container = constraintsRef.current;
    const containerRect = container.getBoundingClientRect();
    const eventRect = eventElement.getBoundingClientRect();
    
    // Calculate the target position to center the event
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const eventCenterX = eventRect.left + eventRect.width / 2;
    const offset = containerCenterX - eventCenterX;
    const currentX = x.get();
    const targetX = currentX + offset;

    // Animate to the target position smoothly
    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.5
    });
  };

  return (
    <div className="timeline-page-container">
      
      {/* --- TOP PANEL: Event Details --- */}
      <div className="details-panel">
        <AnimatePresence mode="wait">
          {loading ? (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="details-content"
            >
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading events...</p>
              </div>
            </MotionDiv>
          ) : error ? (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="details-content"
            >
              <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
                <p>Error: {error}</p>
                <button 
                  onClick={fetchEvents}
                  style={{ 
                    marginTop: '20px', 
                    padding: '10px 20px', 
                    cursor: 'pointer',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Retry
                </button>
              </div>
            </MotionDiv>
          ) : events.length === 0 ? (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="details-content"
            >
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No approved events found. Check back later!</p>
              </div>
            </MotionDiv>
          ) : activeEvent ? (
            <MotionDiv
              key={activeEvent._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="details-content"
            >
              <div style={{ 
                background: 'linear-gradient(135deg, #1c232b 0%, #2a3039 100%)', 
                height: '100%', 
                overflow: 'hidden',
                padding: '20px'
              }}>
                {/* Modern Dashboard Layout */}
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '55fr 45fr',
                  gap: '20px',
                  height: '100%',
                  maxHeight: 'calc(100vh - 100px)'
                }}>
                  
                  {/* LEFT COLUMN */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px',
                    overflow: 'hidden'
                  }}>
                    {/* Title Card */}
                    <MotionDiv
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(42, 48, 57, 0.95) 0%, rgba(31, 38, 46, 1) 100%)',
                        padding: '24px 28px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
                        border: '1px solid rgba(62, 191, 255, 0.2)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <h1 style={{
                        fontSize: '1.9em',
                        fontWeight: '700',
                        marginBottom: '16px',
                        lineHeight: '1.2',
                        color: '#3ebfff'
                      }}>
                        {activeEvent.title}
                      </h1>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          padding: '6px 14px',
                          background: 'linear-gradient(135deg, #3ebfff 0%, #30a6e5 100%)',
                          color: 'white',
                          borderRadius: '8px',
                          fontSize: '0.8em',
                          fontWeight: '600',
                          boxShadow: '0 4px 12px rgba(62,191,255,0.3)'
                        }}>
                          {activeEvent.category}
                        </span>
                        {activeEvent.year && (
                          <span style={{
                            padding: '6px 14px',
                            background: 'rgba(255,193,7,0.15)',
                            color: '#ffc107',
                            borderRadius: '8px',
                            fontSize: '0.8em',
                            fontWeight: '600',
                            border: '1px solid rgba(255,193,7,0.3)'
                          }}>
                            {activeEvent.year}
                          </span>
                        )}
                        {activeEvent.severity && (
                          <span style={{
                            padding: '6px 14px',
                            background: 'rgba(239,68,68,0.1)',
                            color: '#ef4444',
                            borderRadius: '8px',
                            fontSize: '0.8em',
                            fontWeight: '600',
                            border: '1px solid rgba(239,68,68,0.2)'
                          }}>
                            {activeEvent.severity}
                          </span>
                        )}
                        <span style={{ 
                          fontSize: '0.85em', 
                          color: '#a9a9a9',
                          fontWeight: '500'
                        }}>
                          📅 {new Date(activeEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </MotionDiv>

                    {/* Image Slideshow */}
                    {activeEvent.imageUrls && activeEvent.imageUrls.length > 0 && (
                      <MotionDiv
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ y: -3, transition: { duration: 0.3 } }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(42, 48, 57, 0.95) 0%, rgba(31, 38, 46, 1) 100%)',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)',
                          border: '1px solid rgba(62, 191, 255, 0.2)',
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: '0'
                        }}
                      >
                        <div style={{ flex: '1', display: 'flex', minHeight: '0', overflow: 'hidden' }}>
                          <ImageSlideshow images={activeEvent.imageUrls || []} eventTitle={activeEvent.title} />
                        </div>
                      </MotionDiv>
                    )}
                  </div>

                  {/* RIGHT COLUMN */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    overflowY: 'auto',
                    maxHeight: '100%'
                  }}>
                    {/* Description */}
                    <MotionDiv
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(42, 48, 57, 0.95) 0%, rgba(31, 38, 46, 1) 100%)',
                        padding: '20px 24px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
                        border: '1px solid rgba(62, 191, 255, 0.2)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          background: 'linear-gradient(135deg, #3ebfff 0%, #30a6e5 100%)',
                          color: 'white',
                          borderRadius: '8px',
                          fontSize: '0.75em',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '16px',
                          boxShadow: '0 4px 12px rgba(62,191,255,0.3)'
                        }}>
                          Description
                        </div>
                        <p style={{
                          fontSize: '0.9em',
                          lineHeight: '1.7',
                          color: '#d1d1d1',
                          margin: 0
                        }}>
                          {activeEvent.description}
                        </p>
                      </div>
                    </MotionDiv>

                    {/* Metadata */}
                    {activeEvent.location && (
                      <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(42, 48, 57, 0.95) 0%, rgba(31, 38, 46, 1) 100%)',
                          padding: '16px 20px',
                          borderRadius: '16px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
                          border: '1px solid rgba(62, 191, 255, 0.2)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '0.9em',
                          color: '#d1d1d1',
                          fontWeight: '500'
                        }}>
                          <span style={{ fontSize: '1.2em' }}>📍</span> {activeEvent.location}
                        </div>
                      </MotionDiv>
                    )}

                    {/* Impact Summary */}
                    {activeEvent.impactSummary && (
                      <MotionDiv
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(42, 48, 57, 0.95) 0%, rgba(31, 38, 46, 1) 100%)',
                          padding: '20px 24px',
                          borderRadius: '16px',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)',
                          border: '2px solid rgba(62,191,255,0.4)'
                        }}
                      >
                        <div style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          background: 'linear-gradient(135deg, #3ebfff 0%, #30a6e5 100%)',
                          color: 'white',
                          borderRadius: '8px',
                          fontSize: '0.75em',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '16px',
                          boxShadow: '0 4px 12px rgba(62,191,255,0.3)'
                        }}>
                          Impact Summary
                        </div>
                        <p style={{
                          fontSize: '0.9em',
                          lineHeight: '1.7',
                          color: '#d1d1d1',
                          margin: 0
                        }}>
                          {activeEvent.impactSummary}
                        </p>
                      </MotionDiv>
                    )}

                    {/* Call to Action */}
                    {activeEvent.source && (
                      <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                      >
                        <a 
                          href={activeEvent.source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            textAlign: 'center',
                            padding: '14px 24px',
                            background: 'linear-gradient(135deg, #3ebfff 0%, #30a6e5 100%)',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '0.9em',
                            boxShadow: '0 8px 24px rgba(62,191,255,0.4), 0 4px 12px rgba(62,191,255,0.3)',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <span style={{ position: 'relative', zIndex: 1 }}>
                            Read Full Article →
                          </span>
                        </a>
                      </MotionDiv>
                    )}
                  </div>

                </div>
              </div>
            </MotionDiv>
          ) : null}
        </AnimatePresence>
      </div>

      {/* --- BOTTOM PANEL: Horizontal Slider/Timeline --- */}
      {!loading && !error && events.length > 0 && (
      <div className="timeline-slider-container" ref={constraintsRef}>
        <MotionDiv
            ref={sliderContentRef}
          className="timeline-slider-content"
          drag="x" // Enable horizontal dragging
          dragConstraints={constraintsRef} // Constrain dragging to the parent
            dragElastic={1.0} // Add some elasticity
            onDrag={() => {
              // Update during drag to provide real-time feedback
              const closestEvent = findClosestEvent();
              if (closestEvent && (!activeEvent || closestEvent._id !== activeEvent._id)) {
                setActiveEvent(closestEvent);
              }
            }}
            onDragEnd={handleDragEnd}
            style={{ x }}
        >
          {/* This is the horizontal bar */}
          <div className="timeline-bar"></div>
          
          {/* Map over the events */}
            {events.map((event, index) => (
            <div
                ref={(el) => {
                  if (el) eventRefs.current[event._id] = el;
                }}
              className={`timeline-item ${activeEvent?._id === event._id ? 'timeline-item-active' : ''}`}
              key={event._id}
                onClick={() => {
                  setActiveEvent(event);
                  // Snap to center when clicked
                  handleDragEnd();
                }}
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
      )}
    </div>
  );
};

export default TimelinePage;
