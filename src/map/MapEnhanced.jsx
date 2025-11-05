import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import L from "leaflet";
import "./map.css";

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// BC approximate boundaries
const BC_BOUNDS = [
  [48.0, -139.0], // Southwest corner
  [60.0, -114.0], // Northeast corner
];

const BC_CENTER = [53.7267, -127.6476];
const BC_ZOOM = 6;

// BC Regions with approximate polygon boundaries
const BC_REGIONS = {
  "Northern BC": {
    center: [57.0, -125.0],
    bounds: [
      [54.0, -131.0],
      [54.0, -119.0],
      [60.0, -119.0],
      [60.0, -131.0],
      [54.0, -131.0],
    ],
    color: "#3498db",
    cities: ["Prince George", "Fort St. John", "Terrace"],
  },
  "Thompson-Okanagan": {
    center: [50.5, -119.0],
    bounds: [
      [49.0, -121.0],
      [49.0, -117.0],
      [52.0, -117.0],
      [52.0, -121.0],
      [49.0, -121.0],
    ],
    color: "#e74c3c",
    cities: ["Kamloops", "Kelowna", "Vernon"],
  },
  "Lower Mainland": {
    center: [49.2, -123.0],
    bounds: [
      [48.8, -123.8],
      [48.8, -122.2],
      [49.5, -122.2],
      [49.5, -123.8],
      [48.8, -123.8],
    ],
    color: "#2ecc71",
    cities: ["Vancouver", "Surrey", "Burnaby"],
  },
  "Vancouver Island & Coast": {
    center: [49.6, -125.0],
    bounds: [
      [48.3, -125.8],
      [48.3, -123.5],
      [50.8, -123.5],
      [50.8, -125.8],
      [48.3, -125.8],
    ],
    color: "#f39c12",
    cities: ["Victoria", "Nanaimo", "Courtenay"],
  },
  "Kootenay/Columbia": {
    center: [49.5, -116.0],
    bounds: [
      [48.5, -118.0],
      [48.5, -114.0],
      [51.0, -114.0],
      [51.0, -118.0],
      [48.5, -118.0],
    ],
    color: "#9b59b6",
    cities: ["Cranbrook", "Nelson", "Castlegar"],
  },
};

// Category colors for event markers
const CATEGORY_COLORS = {
  wildfire: "#ff0000",
  flood: "#0066ff",
  heatwave: "#ff9900",
  "oil spill": "#000000",
  drought: "#8b4513",
  other: "#00ff00",
};

// Component to handle map bounds restriction
function MapBoundsRestrictor() {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.setMaxBounds(BC_BOUNDS);
      map.setMinZoom(5);
      map.setMaxZoom(12);
    }
  }, [map]);

  return null;
}

const MapEnhanced = ({ onRegionSelect, selectedRegion }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, success } = await apiCall(API_ENDPOINTS.EVENTS);
        if (success && data) {
          const eventsWithCoords = await Promise.all(
            data.map(async (event) => {
              try {
                // Geocode location if not already geocoded
                if (!event.lat || !event.lng) {
                  const geocodeResult = await apiCall(
                    API_ENDPOINTS.GEOCODING(event.location)
                  );
                  if (geocodeResult.success) {
                    return {
                      ...event,
                      lat: geocodeResult.data.lat,
                      lng: geocodeResult.data.lng,
                    };
                  }
                }
                return event;
              } catch (error) {
                console.error(`Error geocoding ${event.location}:`, error);
                return null;
              }
            })
          );
          setEvents(eventsWithCoords.filter((e) => e !== null));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, success } = await apiCall(API_ENDPOINTS.CATEGORIES);
        if (success && data) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Filter events by category
  const filteredEvents = events.filter((event) => {
    if (selectedCategory === "all") return true;
    const category = categories.find((c) => c._id === event.category_id);
    return category && category.title.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Get color for event marker
  const getMarkerColor = (categoryName) => {
    const nameLower = categoryName?.toLowerCase() || "other";
    for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
      if (nameLower.includes(key)) return color;
    }
    return CATEGORY_COLORS.other;
  };

  // Handle region click
  const handleRegionClick = useCallback(
    (regionName) => {
      if (onRegionSelect) {
        onRegionSelect(regionName);
      }
    },
    [onRegionSelect]
  );

  if (loading) {
    return (
      <div className="map-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div>Loading map...</div>
      </div>
    );
  }

  return (
    <div className="map-container-wrapper">
      <MapContainer
        center={BC_CENTER}
        zoom={BC_ZOOM}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        maxBounds={BC_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={5}
        maxZoom={12}
      >
        <MapBoundsRestrictor />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Region Polygons */}
        {Object.entries(BC_REGIONS).map(([regionName, regionData]) => {
          const isSelected = selectedRegion === regionName;
          const isHovered = hoveredRegion === regionName;
          
          return (
            <Polygon
              key={regionName}
              positions={regionData.bounds}
              pathOptions={{
                color: regionData.color,
                fillColor: regionData.color,
                fillOpacity: isSelected ? 0.4 : isHovered ? 0.3 : 0.2,
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => handleRegionClick(regionName),
                mouseover: () => setHoveredRegion(regionName),
                mouseout: () => setHoveredRegion(null),
              }}
            />
          );
        })}

        {/* Event Markers */}
        {filteredEvents.map((event) => {
          if (!event.lat || !event.lng) return null;
          
          const category = categories.find((c) => c._id === event.category_id);
          const categoryName = category?.title || "Other";
          const markerColor = getMarkerColor(categoryName);

          return (
            <Marker key={event.event_id} position={[event.lat, event.lng]}>
              <Popup>
                <div>
                  <strong>{event.title}</strong>
                  <br />
                  <small>
                    {categoryName} - {event.location}
                  </small>
                  <br />
                  <small>Date: {new Date(event.date).toLocaleDateString()}</small>
                  {event.impact_summary && (
                    <>
                      <br />
                      <small>{event.impact_summary.substring(0, 100)}...</small>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Region Selector Dropdown */}
      <div className="map-controls">
        <select
          value={selectedRegion || ""}
          onChange={(e) => handleRegionClick(e.target.value)}
          className="region-selector"
        >
          <option value="">Select a Region</option>
          {Object.keys(BC_REGIONS).map((regionName) => (
            <option key={regionName} value={regionName}>
              {regionName}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.title}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MapEnhanced;

