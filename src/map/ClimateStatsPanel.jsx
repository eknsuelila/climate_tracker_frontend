import React, { useState, useEffect, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import "./ClimateStatsPanel.css";

const ClimateStatsPanel = ({ region, onClose, events = [] }) => {
  const [activeTab, setActiveTab] = useState("historical"); // "historical", "projections", "air-quality"
  
  // Region ID to region name mapping (from backend config)
  const REGION_ID_TO_NAME = {
    "100": "Northern BC",
    "101": "Thompson-Okanagan",
    "102": "Lower Mainland",
    "103": "Vancouver Island & Coast",
    "104": "Kootenay/Columbia"
  };
  
  const IS_DEV = import.meta.env.DEV;
  
  // Count events by region (all events with valid coordinates for that region)
  const eventCountByRegion = useMemo(() => {
    if (!region) {
      if (IS_DEV) {
        console.log(`[ClimateStatsPanel] No region selected`);
      }
      return 0;
    }
    if (!events || events.length === 0) {
      if (IS_DEV) {
        console.log(`[ClimateStatsPanel] No events available. Region: ${region}`);
      }
      return 0;
    }
    
    // Count all events in the selected region with valid coordinates
    const matchingEvents = events.filter(event => {
      if (!event) return false;
      
      // Check if event has region - it might be stored as ID or name
      const eventRegion = event?.region;
      if (!eventRegion) return false;
      
      // Handle both region ID (e.g., "100") and region name (e.g., "Northern BC")
      let eventRegionName = eventRegion;
      if (REGION_ID_TO_NAME[eventRegion]) {
        // If it's a region ID, map it to region name
        eventRegionName = REGION_ID_TO_NAME[eventRegion];
      }
      
      // Check if event region matches the selected region
      if (eventRegionName !== region && eventRegion !== region) return false;
      
      // Must have valid coordinates
      if (!event.lat || !event.lng) return false;
      
      // Include all events regardless of status (user wants total count per region)
      return true;
    });
    
    const count = matchingEvents.length;
    
    // Debug logging with region ID to name mapping
    const availableRegions = [...new Set(events.map(e => e?.region).filter(Boolean))];
      const mappedRegions = availableRegions.map(r => {
        const name = REGION_ID_TO_NAME[r] || r;
        return `${r} → ${name}`;
      });
      
    if (IS_DEV) {
      console.log(`[ClimateStatsPanel] Region: "${region}"`, {
        totalEvents: events.length,
        eventsInRegion: count,
        eventsWithRegions: events.filter(e => e?.region).length,
        availableRegions: availableRegions,
        mappedRegions: mappedRegions,
        sampleEventRegions: events.slice(0, 5).map(e => {
          const r = e?.region;
          return `${r} → ${REGION_ID_TO_NAME[r] || r}`;
        })
      });
    }
    
    if (count === 0 && events.length > 0 && availableRegions.length > 0 && IS_DEV) {
      console.warn(`[ClimateStatsPanel] ⚠️ No events found for region "${region}". Available regions (ID → Name):`, mappedRegions);
    }
    
    return count;
  }, [region, events]);
  
  // Historical data state
  const [climateData, setClimateData] = useState(null);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [historicalError, setHistoricalError] = useState(null);
  
  // Projections data state
  const [projectionsData, setProjectionsData] = useState(null);
  const [projectionsLoading, setProjectionsLoading] = useState(false);
  const [projectionsError, setProjectionsError] = useState(null);
  // Fixed model and scenario (high emissions)
  const PROJECTION_MODEL = "CMCC_CM2_VHR4";
  const PROJECTION_SCENARIO = "ssp585"; // High emissions
  
  // Air quality data state
  const [airQualityData, setAirQualityData] = useState(null);
  const [airQualityLoading, setAirQualityLoading] = useState(false);
  const [airQualityError, setAirQualityError] = useState(null);

  // Fetch historical data
  useEffect(() => {
    if (!region) {
      setClimateData(null);
      return;
    }

    const fetchClimateData = async () => {
      setHistoricalLoading(true);
      setHistoricalError(null);
      
      try {
        const { data, success, error: apiError } = await apiCall(
          API_ENDPOINTS.CLIMATE_REGION(region)
        );

        if (success && data) {
          setClimateData(data);
        } else {
          setHistoricalError(apiError || "Failed to fetch climate data");
        }
      } catch (err) {
        setHistoricalError(err.message || "An error occurred");
        if (IS_DEV) {
          console.error("Error fetching climate data:", err);
        }
      } finally {
        setHistoricalLoading(false);
      }
    };

    fetchClimateData();
  }, [region]);

  // Fetch projections data
  useEffect(() => {
    if (!region || activeTab !== "projections") return;

    const fetchProjections = async () => {
      setProjectionsLoading(true);
      setProjectionsError(null);
      
      try {
        const { data, success, error: apiError } = await apiCall(
          API_ENDPOINTS.CLIMATE_PROJECTIONS(region, PROJECTION_MODEL, PROJECTION_SCENARIO)
        );

        if (success && data) {
          setProjectionsData(data);
        } else {
          setProjectionsError(apiError || "Failed to fetch projections data");
        }
      } catch (err) {
        setProjectionsError(err.message || "An error occurred");
        if (IS_DEV) {
          console.error("Error fetching projections:", err);
        }
      } finally {
        setProjectionsLoading(false);
      }
    };

    fetchProjections();
  }, [region, activeTab]);

  // Fetch air quality data
  useEffect(() => {
    if (!region || activeTab !== "air-quality") return;

    const fetchAirQuality = async () => {
      setAirQualityLoading(true);
      setAirQualityError(null);
      
      try {
        const { data, success, error: apiError } = await apiCall(
          API_ENDPOINTS.CLIMATE_AIR_QUALITY(region)
        );

        if (success && data) {
          setAirQualityData(data);
        } else {
          setAirQualityError(apiError || "Failed to fetch air quality data");
        }
      } catch (err) {
        setAirQualityError(err.message || "An error occurred");
        if (IS_DEV) {
          console.error("Error fetching air quality:", err);
        }
      } finally {
        setAirQualityLoading(false);
      }
    };

    fetchAirQuality();
    
    // Refresh air quality every 5 minutes
    const interval = setInterval(fetchAirQuality, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [region, activeTab]);

  if (!region) {
    return null; // Don't render panel when no region is selected
  }

  const loading = historicalLoading || projectionsLoading || airQualityLoading;
  const error = historicalError || projectionsError || airQualityError;

  if (loading && !climateData && !projectionsData && !airQualityData) {
    return (
      <div className="climate-stats-panel">
        <div className="loading-spinner">Loading climate data...</div>
      </div>
    );
  }

  return (
    <div className="climate-stats-panel">
      <div className="panel-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>{region}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="close-button"
              aria-label="Close panel"
              title="Close panel"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === "historical" ? "active" : ""}`}
            onClick={() => setActiveTab("historical")}
          >
            Historical
          </button>
          <button
            className={`tab-button ${activeTab === "projections" ? "active" : ""}`}
            onClick={() => setActiveTab("projections")}
          >
            Projections
          </button>
          <button
            className={`tab-button ${activeTab === "air-quality" ? "active" : ""}`}
            onClick={() => setActiveTab("air-quality")}
          >
            Air Quality
          </button>
        </div>
      </div>

      {/* Historical Trends Tab */}
      {activeTab === "historical" && (
        <HistoricalTab 
          climateData={climateData}
          loading={historicalLoading}
          error={historicalError}
          eventCountByRegion={eventCountByRegion}
        />
      )}

      {/* Future Projections Tab */}
      {activeTab === "projections" && (
        <ProjectionsTab
          region={region}
          projectionsData={projectionsData}
          loading={projectionsLoading}
          error={projectionsError}
        />
      )}

      {/* Air Quality Tab */}
      {activeTab === "air-quality" && (
        <AirQualityTab
          airQualityData={airQualityData}
          loading={airQualityLoading}
          error={airQualityError}
        />
      )}
    </div>
  );
};

// Historical Trends Component
const HistoricalTab = ({ climateData, loading, error, eventCountByRegion = 0 }) => {
  if (loading && !climateData) {
    return <div className="loading-spinner">Loading historical data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!climateData) {
    return <div className="no-data">No historical data available</div>;
  }

  // Safely destructure with defaults to prevent errors
  const { 
    historical = [], 
    avg_temperature = null, 
    total_precipitation = null, 
    avg_snowfall = null, 
    event_count = 0, 
    insights = [], 
    cities = [],
    source = null,
    model = null,
    data_range = null
  } = climateData || {};

  // Prepare chart data - safely handle missing historical array
  const chartData = Array.isArray(historical) 
    ? historical
        .filter(entry => entry && entry.year) // Filter out invalid entries
        .map((entry) => ({
          year: entry.year,
          temperature: entry.temperature ?? null,
          precipitation: entry.precipitation ?? null,
          snowfall: entry.snowfall ?? null,
        }))
    : [];

  return (
    <>
      <div className="data-source">
        Source: {
          source === "open_meteo_api" 
            ? `Open-Meteo API${model ? ` (${model})` : ""}`
            : source === "fallback_data"
            ? "Fallback Data"
            : "Unknown"
        }
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Avg Temperature</div>
          <div className="stat-value">
            {avg_temperature ? `${avg_temperature}°C` : "N/A"}
          </div>
        </div>
        {avg_snowfall !== null && avg_snowfall !== undefined && (
          <div className="stat-card">
            <div className="stat-label">Avg Snowfall</div>
            <div className="stat-value">
              {avg_snowfall ? `${avg_snowfall.toFixed(0)} mm` : "N/A"}
            </div>
          </div>
        )}
        <div className="stat-card">
          <div className="stat-label">Climate Events</div>
          <div className="stat-value">{eventCountByRegion ?? 0}</div>
        </div>
      </div>

      {/* Cities List */}
      {cities && cities.length > 0 && (
        <div className="cities-section">
          <h4>Major Cities</h4>
          <div className="cities-list">
            {cities.map((city, index) => (
              <span key={index} className="city-tag">
                {city}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Temperature Chart */}
      {chartData.length > 0 && (
        <div className="chart-section">
          <h4>Temperature Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: "°C", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#e74c3c"
                strokeWidth={2}
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Snowfall Chart (if available) */}
      {chartData.length > 0 && chartData.some(d => d.snowfall !== null && d.snowfall !== undefined) && (
        <div className="chart-section">
          <h4>Snowfall Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: "mm", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="snowfall" fill="#9b59b6" name="Snowfall (mm)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="insights-section">
          <h4>Climate Insights</h4>
          <ul className="insights-list">
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Range */}
      {data_range && data_range.start && data_range.end && (
        <div className="data-range">
          <small>
            Data Range: {data_range.start} to {data_range.end}
          </small>
        </div>
      )}
    </>
  );
};

// Future Projections Component
const ProjectionsTab = ({ region, projectionsData, loading, error }) => {
  if (loading && !projectionsData) {
    return <div className="loading-spinner">Loading projections...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <>
      {projectionsData ? (
        <>
          <div className="data-source">
            Source: Open-Meteo Climate API ({projectionsData.model}, High Emissions - SSP5-8.5)
          </div>

          {/* Projections Summary */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Projection Period</div>
              <div className="stat-value">
                {projectionsData.projections?.[0]?.year || "N/A"} - {projectionsData.projections?.[projectionsData.projections.length - 1]?.year || "N/A"}
              </div>
            </div>
            {projectionsData.projections && projectionsData.projections.length > 0 && (
              <>
                <div className="stat-card">
                  <div className="stat-label">2040 Avg Precipitation</div>
                  <div className="stat-value">
                    {projectionsData.projections.find(p => p.year === 2040)?.precipitation 
                      ? `${projectionsData.projections.find(p => p.year === 2040).precipitation.toFixed(0)} mm`
                      : projectionsData.projections[projectionsData.projections.length - 1]?.precipitation
                      ? `${projectionsData.projections[projectionsData.projections.length - 1].precipitation.toFixed(0)} mm`
                      : "N/A"}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">2040 Avg Temp</div>
                  <div className="stat-value">
                    {projectionsData.projections.find(p => p.year === 2040)?.temperature 
                      ? `${projectionsData.projections.find(p => p.year === 2040).temperature}°C`
                      : projectionsData.projections[projectionsData.projections.length - 1]?.temperature
                      ? `${projectionsData.projections[projectionsData.projections.length - 1].temperature}°C`
                      : "N/A"}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Projections Chart */}
          {projectionsData.projections && projectionsData.projections.length > 0 && (
            <div className="chart-section">
              <h4>Temperature Projections</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={projectionsData.projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: "°C", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#f39c12"
                    strokeWidth={2}
                    name="Avg Temperature (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature_max"
                    stroke="#e74c3c"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    name="Max Temperature (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Days Above 30°C Chart */}
          {projectionsData.projections && projectionsData.projections.length > 0 && (
            <div className="chart-section">
              <h4>Days Above 30°C (Heat Days)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={projectionsData.projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="days_above_30c" fill="#ff6b6b" name="Days Above 30°C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Precipitation Projections */}
          {projectionsData.projections && projectionsData.projections.length > 0 && (
            <div className="chart-section">
              <h4>Precipitation Projections</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={projectionsData.projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: "mm", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="precipitation" fill="#3498db" name="Precipitation (mm)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="no-data">Select model and scenario to view projections</div>
      )}
    </>
  );
};

// Air Quality Component
const AirQualityTab = ({ airQualityData, loading, error }) => {
  if (loading && !airQualityData) {
    return <div className="loading-spinner">Loading air quality data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!airQualityData) {
    return <div className="no-data">No air quality data available</div>;
  }

  const { current, averages_24h } = airQualityData;
  const getAQIColor = (aqiValue) => {
    if (aqiValue <= 1) return "#2ecc71"; // Good - Green
    if (aqiValue === 2) return "#f39c12"; // Moderate - Orange
    if (aqiValue === 3) return "#e67e22"; // Unhealthy for Sensitive - Dark Orange
    if (aqiValue === 4) return "#e74c3c"; // Unhealthy - Red
    return "#8e44ad"; // Very Unhealthy - Purple
  };

  return (
    <>
      <div className="data-source">
        Source: Open-Meteo Air Quality API
        {current?.time && <div style={{ fontSize: "0.75rem", marginTop: "5px" }}>Last updated: {new Date(current.time).toLocaleString()}</div>}
      </div>

      {/* Current Air Quality */}
      {current && (
        <>
          <div className="aqi-display" style={{ backgroundColor: getAQIColor(current.aqi_value || 1), padding: "20px", borderRadius: "12px", marginBottom: "20px", textAlign: "center" }}>
            <div className="aqi-label" style={{ fontSize: "0.9rem", opacity: 0.9 }}>Air Quality Index</div>
            <div className="aqi-value" style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#fff" }}>
              {current.aqi || "N/A"}
            </div>
          </div>

          {/* Current Values */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">PM2.5 (Smoke)</div>
              <div className="stat-value">
                {current.pm2_5 !== null && current.pm2_5 !== undefined ? `${current.pm2_5.toFixed(1)} µg/m³` : "N/A"}
              </div>
              <div className="stat-note" style={{ fontSize: "0.75rem", marginTop: "5px", color: "#b0b0b0" }}>
                {current.pm2_5 > 55 ? "⚠️ High - Possible wildfire smoke" : current.pm2_5 > 35 ? "Moderate" : "Good"}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">PM10</div>
              <div className="stat-value">
                {current.pm10 !== null && current.pm10 !== undefined ? `${current.pm10.toFixed(1)} µg/m³` : "N/A"}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Carbon Monoxide</div>
              <div className="stat-value">
                {current.carbon_monoxide !== null && current.carbon_monoxide !== undefined 
                  ? `${current.carbon_monoxide.toFixed(2)} µg/m³` 
                  : "N/A"}
              </div>
            </div>
            {/* Note: Carbon Dioxide not available in hourly format from Open-Meteo Air Quality API */}
          </div>

          {/* 24-Hour Averages */}
          {averages_24h && Object.keys(averages_24h).length > 0 && (
            <div className="chart-section">
              <h4>24-Hour Averages</h4>
              <div className="stats-grid">
                {averages_24h.pm2_5_24h_avg !== null && (
                  <div className="stat-card">
                    <div className="stat-label">PM2.5 (24h avg)</div>
                    <div className="stat-value">{averages_24h.pm2_5_24h_avg.toFixed(1)} µg/m³</div>
                  </div>
                )}
                {averages_24h.pm10_24h_avg !== null && (
                  <div className="stat-card">
                    <div className="stat-label">PM10 (24h avg)</div>
                    <div className="stat-value">{averages_24h.pm10_24h_avg.toFixed(1)} µg/m³</div>
                  </div>
                )}
                {averages_24h.co_24h_avg !== null && (
                  <div className="stat-card">
                    <div className="stat-label">CO (24h avg)</div>
                    <div className="stat-value">{averages_24h.co_24h_avg.toFixed(2)} µg/m³</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {airQualityData.note && (
            <div className="insights-section">
              <div className="insights-list">
                <li>{airQualityData.note}</li>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ClimateStatsPanel;
