import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import { useCategoriesCached } from "../hooks/useCategoriesCached.js";
import { useEventsAllCached } from "../hooks/useEventsCached.js";
import { useQueryClient } from "@tanstack/react-query";
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

// Create custom category icon with color
const createCategoryIcon = (categoryName, isAdjusted = false) => {
  const categoryLower = categoryName.toLowerCase().trim();
  let color = CATEGORY_COLORS.other;
  
  // Match category name to colors
  if (categoryLower.includes("wildfire") || categoryLower.includes("fire")) {
    color = CATEGORY_COLORS.wildfire;
  } else if (categoryLower.includes("flood") || categoryLower.includes("flooding")) {
    color = CATEGORY_COLORS.flood;
  } else if (categoryLower.includes("heatwave") || categoryLower.includes("heat")) {
    color = CATEGORY_COLORS.heatwave;
  } else if (categoryLower.includes("oil") || categoryLower.includes("spill")) {
    color = CATEGORY_COLORS["oil spill"];
  } else if (categoryLower.includes("drought")) {
    color = CATEGORY_COLORS.drought;
  }
  
  return L.divIcon({
    className: "custom-category-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border: 2px solid ${isAdjusted ? "#ff0000" : "#ffffff"};
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: white;
      ">
        ${isAdjusted ? "⚠" : ""}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
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

// Region ID to region name mapping (from backend config)
const REGION_ID_TO_NAME = {
  "100": "Northern BC",
  "101": "Thompson-Okanagan",
  "102": "Lower Mainland",
  "103": "Vancouver Island & Coast",
  "104": "Kootenay/Columbia"
};

const IS_DEV = import.meta.env.DEV;

const MapEnhanced = ({ onRegionSelect, selectedRegion, onEventsUpdate }) => {
  const queryClient = useQueryClient();
  const [processedEvents, setProcessedEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [regionGeoJSON, setRegionGeoJSON] = useState({}); // {regionName: geojsonFeature}
  
  // Fetch all events using cached hook (no status filter to get all events)
  const { events: rawEvents, loading: eventsLoading, error: eventsError } = useEventsAllCached({
    enabled: true,
    status: null, // Get all events (approved, pending, etc.)
  });

  // Fetch categories using cached hook
  const { categories, loading: categoriesLoading } = useCategoriesCached();

  // Process events: geocode missing coordinates (backward compatibility)
  useEffect(() => {
    const processEvents = async () => {
      if (!rawEvents || rawEvents.length === 0) {
        setProcessedEvents([]);
        if (onEventsUpdate) {
          onEventsUpdate([]);
        }
        return;
      }

      if (IS_DEV) {
        console.log(`📊 Processing ${rawEvents.length} events for map`);
      }
      
      // Events should now have lat/lng stored in database
      // Only geocode if coordinates are missing (for backward compatibility with old events)
      const eventsWithCoords = await Promise.all(
        rawEvents.map(async (event) => {
          try {
            if (!event.lat || !event.lng) {
              // Fallback: geocode only if coordinates are missing
              // Include region in geocoding request to ensure coordinates match region
              const geocodeUrl = event.region 
                ? `${API_ENDPOINTS.GEOCODING(event.location)}&region=${encodeURIComponent(event.region)}`
                : API_ENDPOINTS.GEOCODING(event.location);
              
              const geocodeResult = await apiCall(geocodeUrl);
              if (geocodeResult.success && geocodeResult.data) {
                return { 
                  ...event, 
                  lat: geocodeResult.data.lat, 
                  lng: geocodeResult.data.lng,
                  coordinates_adjusted: geocodeResult.data.adjusted || false
                };
              }
            }
            // Event already has coordinates stored - use them directly
            return event;
          } catch (error) {
            if (IS_DEV) {
              console.error(`Error processing event ${event.event_id}:`, error);
            }
            return null;
          }
        })
      );
      
      const validEvents = eventsWithCoords.filter(
        (event) => event && event.lat && event.lng
      );
      
      if (IS_DEV) {
        console.log(`✅ Valid events with coordinates: ${validEvents.length} pins will be displayed`);
      }
      setProcessedEvents(validEvents);
      
      // Notify parent component when events are updated
      if (onEventsUpdate) {
        onEventsUpdate(validEvents);
      }
    };

    processEvents();
  }, [rawEvents, onEventsUpdate]);

  // Log errors if any
  useEffect(() => {
    if (eventsError && IS_DEV) {
      console.error("❌ Error fetching events:", eventsError);
    }
  }, [eventsError]);

  // Load and process GeoJSON file
  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const response = await fetch("/ABMS_REGIONAL_DISTRICTS_SP.geojson");
        if (!response.ok) {
          if (IS_DEV) {
            console.warn("Could not load GeoJSON file, using fallback");
          }
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
        if (IS_DEV) {
          console.log("GeoJSON loaded and grouped by region:", Object.keys(groupedByRegion));
        }
      } catch (e) {
        if (IS_DEV) {
          console.error("Error loading GeoJSON:", e);
        }
      }
    };
    
    loadGeoJSON();
  }, []);

  // Filter events by selected category and region
  const filteredEvents = useMemo(() => {
    if (!processedEvents || processedEvents.length === 0) return [];
    return processedEvents.filter((event) => {
      // Filter by category if not "all"
      if (selectedCategory !== "all") {
        const category = categories.find((c) => c._id === event.category_id);
        if (!category || category.title.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }
      
      // Filter by region if selected - handle both region IDs and names
      if (selectedRegion) {
        const eventRegion = event.region;
        // Map region ID to name if needed
        const eventRegionName = REGION_ID_TO_NAME[eventRegion] || eventRegion;
        // Check if event region matches selected region (handle both ID and name)
        if (eventRegionName !== selectedRegion && eventRegion !== selectedRegion) {
          return false;
        }
      }
      
      // Only include events with valid coordinates
      if (!event.lat || !event.lng) {
        return false;
      }
      
      return true;
    });
  }, [processedEvents, selectedCategory, selectedRegion, categories]);

  const handleRegionClick = useCallback(
    (regionName) => {
      if (onRegionSelect) onRegionSelect(regionName);
    },
    [onRegionSelect]
  );

  const loading = eventsLoading || categoriesLoading;

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

          {/* Event Markers with Clustering */}
          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            maxClusterRadius={50}
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              return L.divIcon({
                html: `<div style="
                  background-color: #3ebfff;
                  color: white;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 14px;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                ">${count}</div>`,
                className: "marker-cluster-custom",
                iconSize: L.point(40, 40),
              });
            }}
          >
            {filteredEvents.map((event) => {
              if (!event.lat || !event.lng) return null;
              
              const category = categories.find((c) => c._id === event.category_id);
              const categoryName = category?.title || "Other";
              
              // Check if coordinates match region center (indicating adjustment)
              let isAdjusted = false;
              if (event.region && REGION_CENTERS[event.region]) {
                const regionCenter = REGION_CENTERS[event.region];
                // Check if coordinates are very close to region center (within ~0.01 degrees)
                const latDiff = Math.abs(event.lat - regionCenter.lat);
                const lngDiff = Math.abs(event.lng - regionCenter.lng);
                if (latDiff < 0.01 && lngDiff < 0.01) {
                  // Could be adjusted, but also could be naturally at center
                  // For now, we'll show indicator if geocoding service returned adjusted flag
                  isAdjusted = event.coordinates_adjusted || false;
                }
              }
              
              // Create custom icon based on category and adjustment status
              const customIcon = createCategoryIcon(categoryName, isAdjusted);
              
              // Get category color for popup
              const categoryLower = categoryName.toLowerCase().trim();
              let categoryColor = CATEGORY_COLORS.other;
              if (categoryLower.includes("wildfire") || categoryLower.includes("fire")) {
                categoryColor = CATEGORY_COLORS.wildfire;
              } else if (categoryLower.includes("flood") || categoryLower.includes("flooding")) {
                categoryColor = CATEGORY_COLORS.flood;
              } else if (categoryLower.includes("heatwave") || categoryLower.includes("heat")) {
                categoryColor = CATEGORY_COLORS.heatwave;
              } else if (categoryLower.includes("oil") || categoryLower.includes("spill")) {
                categoryColor = CATEGORY_COLORS["oil spill"];
              } else if (categoryLower.includes("drought")) {
                categoryColor = CATEGORY_COLORS.drought;
              }
              
              return (
                <Marker
                  key={event.event_id || event._id}
                  position={[event.lat, event.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <div style={{ minWidth: "200px" }}>
                      <strong>{event.title}</strong>
                      <br />
                      <small>
                        <span
                          style={{
                            display: "inline-block",
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: categoryColor,
                            marginRight: "5px",
                          }}
                        />
                        {categoryName} - {event.location}
                      </small>
                      <br />
                      <small>Date: {new Date(event.date).toLocaleDateString()}</small>
                      {event.region && (
                        <>
                          <br />
                          <small>Region: {event.region}</small>
                        </>
                      )}
                      {isAdjusted && (
                        <>
                          <br />
                          <small style={{ color: "#ff0000" }}>
                            ⚠ Coordinates adjusted to match region
                          </small>
                        </>
                      )}
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
          </MarkerClusterGroup>
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
