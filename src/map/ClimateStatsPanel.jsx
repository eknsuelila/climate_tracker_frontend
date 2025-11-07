import React, { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import "./ClimateStatsPanel.css";

const ClimateStatsPanel = ({ region }) => {
  const [activeTab, setActiveTab] = useState("historical"); // "historical", "projections", "air-quality"
  
  // Historical data state
  const [climateData, setClimateData] = useState(null);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [historicalError, setHistoricalError] = useState(null);
  
  // Projections data state
  const [projectionsData, setProjectionsData] = useState(null);
  const [projectionsLoading, setProjectionsLoading] = useState(false);
  const [projectionsError, setProjectionsError] = useState(null);
  const [selectedModel, setSelectedModel] = useState("CMCC_CM2_VHR4");
  const [selectedScenario, setSelectedScenario] = useState("ssp585");
  
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
        console.error("Error fetching climate data:", err);
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
          API_ENDPOINTS.CLIMATE_PROJECTIONS(region, selectedModel, selectedScenario)
        );

        if (success && data) {
          setProjectionsData(data);
        } else {
          setProjectionsError(apiError || "Failed to fetch projections data");
        }
      } catch (err) {
        setProjectionsError(err.message || "An error occurred");
        console.error("Error fetching projections:", err);
      } finally {
        setProjectionsLoading(false);
      }
    };

    fetchProjections();
  }, [region, activeTab, selectedModel, selectedScenario]);

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
        console.error("Error fetching air quality:", err);
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
    return (
      <div className="climate-stats-panel closed">
        <p>Select a region to view climate statistics</p>
      </div>
    );
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
        <h3>{region}</h3>
        
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
        />
      )}

      {/* Future Projections Tab */}
      {activeTab === "projections" && (
        <ProjectionsTab
          region={region}
          projectionsData={projectionsData}
          loading={projectionsLoading}
          error={projectionsError}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedScenario={selectedScenario}
          setSelectedScenario={setSelectedScenario}
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
const HistoricalTab = ({ climateData, loading, error }) => {
  if (loading && !climateData) {
    return <div className="loading-spinner">Loading historical data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!climateData) {
    return <div className="no-data">No historical data available</div>;
  }

  const { historical, avg_temperature, total_precipitation, avg_snowfall, event_count, insights, cities } = climateData;

  // Prepare chart data
  const chartData = historical.map((entry) => ({
    year: entry.year,
    temperature: entry.temperature,
    precipitation: entry.precipitation,
    snowfall: entry.snowfall,
  }));

  return (
    <>
      <div className="data-source">
        Source: {
          climateData.source === "open_meteo_api" 
            ? `Open-Meteo API${climateData.model ? ` (${climateData.model})` : ""}`
            : climateData.source === "fallback_data"
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
        <div className="stat-card">
          <div className="stat-label">Total Precipitation</div>
          <div className="stat-value">
            {total_precipitation ? `${total_precipitation.toFixed(0)} mm` : "N/A"}
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
          <div className="stat-value">{event_count || 0}</div>
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

      {/* Precipitation Chart */}
      {chartData.length > 0 && (
        <div className="chart-section">
          <h4>Precipitation Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
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
      {climateData.data_range && (
        <div className="data-range">
          <small>
            Data Range: {climateData.data_range.start} to {climateData.data_range.end}
          </small>
        </div>
      )}
    </>
  );
};

// Future Projections Component
const ProjectionsTab = ({ region, projectionsData, loading, error, selectedModel, setSelectedModel, selectedScenario, setSelectedScenario }) => {
  if (loading && !projectionsData) {
    return <div className="loading-spinner">Loading projections...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <>
      <div className="projections-controls">
        <div className="control-group">
          <label>Model:</label>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="control-select"
          >
            <option value="CMCC_CM2_VHR4">CMCC CM2 VHR4</option>
            <option value="EC_Earth3P_HR">EC Earth3P HR</option>
            <option value="HadGEM3_GC31_MM">HadGEM3 GC31 MM</option>
          </select>
        </div>
        <div className="control-group">
          <label>Scenario:</label>
          <select 
            value={selectedScenario} 
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="control-select"
          >
            <option value="ssp126">Low Emissions (SSP1-2.6)</option>
            <option value="ssp585">High Emissions (SSP5-8.5)</option>
          </select>
        </div>
      </div>

      {projectionsData ? (
        <>
          <div className="data-source">
            Source: Open-Meteo Climate API ({projectionsData.model}, {projectionsData.scenario_name})
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
                  <div className="stat-label">2050 Avg Temp</div>
                  <div className="stat-value">
                    {projectionsData.projections.find(p => p.year === 2050)?.temperature 
                      ? `${projectionsData.projections.find(p => p.year === 2050).temperature}°C`
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
