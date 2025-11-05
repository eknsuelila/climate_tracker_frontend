import React, { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { API_ENDPOINTS, apiCall } from "../service/api.js";
import "./ClimateStatsPanel.css";

const ClimateStatsPanel = ({ region }) => {
  const [climateData, setClimateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!region) {
      setClimateData(null);
      return;
    }

    const fetchClimateData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, success, error: apiError } = await apiCall(
          API_ENDPOINTS.CLIMATE_REGION(region)
        );

        if (success && data) {
          setClimateData(data);
        } else {
          setError(apiError || "Failed to fetch climate data");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
        console.error("Error fetching climate data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClimateData();
  }, [region]);

  if (!region) {
    return (
      <div className="climate-stats-panel closed">
        <p>Select a region to view climate statistics</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="climate-stats-panel">
        <div className="loading-spinner">Loading climate data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="climate-stats-panel">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  if (!climateData) {
    return (
      <div className="climate-stats-panel">
        <div className="no-data">No climate data available</div>
      </div>
    );
  }

  const { historical, avg_temperature, total_precipitation, event_count, insights, cities } = climateData;

  // Prepare chart data
  const chartData = historical.map((entry) => ({
    year: entry.year,
    temperature: entry.temperature,
    precipitation: entry.precipitation,
  }));

  return (
    <div className="climate-stats-panel">
      <div className="panel-header">
        <h3>{region}</h3>
        <div className="data-source">
          Source: {climateData.source === "open_meteo_api" ? "Open-Meteo API" : "Mock Data"}
        </div>
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
    </div>
  );
};

export default ClimateStatsPanel;
