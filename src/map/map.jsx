import React, { useState } from "react";
import MapEnhanced from "./MapEnhanced";
import ClimateStatsPanel from "./ClimateStatsPanel";
import "./map.css";

const Map = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [events, setEvents] = useState([]);

  const handleRegionSelect = (regionName) => {
    setSelectedRegion(regionName);
  };

  const handleClosePanel = () => {
    setSelectedRegion(null);
  };

  return (
    <div className="map-page">
      <div className="map-info">
        <h2>Environmental Events Map - British Columbia</h2>
        <p>
          Explore climate events across British Columbia. Click on regions or use the dropdown to view
          climate statistics and historical data. Click on event markers to see details.
        </p>
      </div>

      <div style={{ position: "relative", width: "100%", height: "calc(100vh - 200px)", minHeight: "600px" }}>
        <MapEnhanced 
          onRegionSelect={handleRegionSelect} 
          selectedRegion={selectedRegion}
          onEventsUpdate={setEvents}
        />
        <ClimateStatsPanel 
          region={selectedRegion} 
          onClose={handleClosePanel}
          events={events}
        />
      </div>
    </div>
  );
};

export default Map;
