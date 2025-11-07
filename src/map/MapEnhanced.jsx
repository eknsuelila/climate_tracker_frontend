import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import L from "leaflet";
import { Slab } from "react-loading-indicators";
import { REGIONAL_DISTRICT_TO_REGION, REGION_COLORS, REGION_CENTERS } from "../config/regionMapping.js";
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
  [48.0, -139.0],
  [60.0, -114.0],
];

const BC_CENTER = [53.7267, -127.6476];
const BC_ZOOM = 6;

// BC Regions configuration (using imported constants)
const BC_REGIONS = {
  "Northern BC": {
    center: REGION_CENTERS["Northern BC"],
    color: REGION_COLORS["Northern BC"],
  },
  "Thompson-Okanagan": {
    center: REGION_CENTERS["Thompson-Okanagan"],
    color: REGION_COLORS["Thompson-Okanagan"],
  },
  "Lower Mainland": {
    center: REGION_CENTERS["Lower Mainland"],
    color: REGION_COLORS["Lower Mainland"],
  },
  "Vancouver Island & Coast": {
    center: REGION_CENTERS["Vancouver Island & Coast"],
    color: REGION_COLORS["Vancouver Island & Coast"],
  },
  "Kootenay/Columbia": {
    center: REGION_CENTERS["Kootenay/Columbia"],
    color: REGION_COLORS["Kootenay/Columbia"],
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

// Restrict map to BC bounds
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
  const [regionGeoJSON, setRegionGeoJSON] = useState({}); // {regionName: geojsonFeature}

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, success } = await apiCall(API_ENDPOINTS.EVENTS);
        if (success && data) {
          const eventsWithCoords = await Promise.all(
            data.map(async (event) => {
              try {
                if (!event.lat || !event.lng) {
                  const geocodeResult = await apiCall(API_ENDPOINTS.GEOCODING(event.location));
                  if (geocodeResult.success) {
                    return { ...event, lat: geocodeResult.data.lat, lng: geocodeResult.data.lng };
                  }
                }
                return event;
              } catch {
                return null;
              }
            })
          );
          setEvents(eventsWithCoords.filter(Boolean));
        }
      } catch (e) {
        console.error("Error fetching events:", e);
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
        if (success && data) setCategories(data);
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    };
    fetchCategories();
  }, []);

  // Load and process GeoJSON file
  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const response = await fetch("/ABMS_REGIONAL_DISTRICTS_SP.geojson");
        if (!response.ok) {
          console.warn("Could not load GeoJSON file, using fallback");
          return;
        }
        
        const geojsonData = await response.json();
        
        // Group features by high-level region
        const groupedByRegion = {};
        
        geojsonData.features.forEach((feature) => {
          const districtName = feature.properties?.ADMIN_AREA_NAME;
          const highLevelRegion = REGIONAL_DISTRICT_TO_REGION[districtName];
          
          if (highLevelRegion) {
            if (!groupedByRegion[highLevelRegion]) {
              groupedByRegion[highLevelRegion] = {
                type: "FeatureCollection",
                features: [],
              };
            }
            groupedByRegion[highLevelRegion].features.push(feature);
          }
        });
        
        setRegionGeoJSON(groupedByRegion);
        console.log("GeoJSON loaded and grouped by region:", Object.keys(groupedByRegion));
      } catch (e) {
        console.error("Error loading GeoJSON:", e);
      }
    };
    
    loadGeoJSON();
  }, []);

  // Filter events by selected category
  const filteredEvents = events.filter((event) => {
    if (selectedCategory === "all") return true;
    const category = categories.find((c) => c._id === event.category_id);
    return category && category.title.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleRegionClick = useCallback(
    (regionName) => {
      if (onRegionSelect) onRegionSelect(regionName);
    },
    [onRegionSelect]
  );

  return (
    <div className="map-container-wrapper">
      {/* Loader overlays only the map area, so the page heading (in map.jsx) remains visible */}
      {loading ? (
        <div className="map-loading-overlay">
          <Slab color="#3ebfff" size="large" text="Loading Map Data..." textColor="#ffffff" />
        </div>
      ) : (
        <MapContainer
          center={BC_CENTER}
          zoom={BC_ZOOM}
          scrollWheelZoom
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

          {/* Region Polygons from GeoJSON */}
          {Object.keys(BC_REGIONS).map((regionName) => {
            const isSelected = selectedRegion === regionName;
            const isHovered = hoveredRegion === regionName;
            const regionData = BC_REGIONS[regionName];
            const geojsonData = regionGeoJSON[regionName];
            
            if (!geojsonData || !geojsonData.features || geojsonData.features.length === 0) {
              // Fallback: don't render if GeoJSON not loaded yet
              return null;
            }
            
            return (
              <GeoJSON
                key={regionName}
                data={geojsonData}
                style={() => ({
                  color: regionData.color,
                  fillColor: regionData.color,
                  fillOpacity: isSelected ? 0.4 : isHovered ? 0.3 : 0.2,
                  weight: isSelected ? 3 : 2,
                })}
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
      )}

      {/* Controls shown only after load */}
      {!loading && (
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
      )}
    </div>
  );
};

export default MapEnhanced;
