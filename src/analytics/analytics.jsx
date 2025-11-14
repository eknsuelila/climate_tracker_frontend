import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../service/api.js";
import { generateAnalyticsSummary } from "../service/geminiService.js"; // 🧠 Gemini integration
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./analytics.css";

const Analytics = () => {
  const [eventData, setEventData] = useState([]);
  const [impactData, setImpactData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("Thompson-Okanagan");
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState(""); // 🧠 AI summary state
  const [aiLoading, setAiLoading] = useState(false); // 🧠 Loading state for AI

  const COLORS = ["#3ebfff", "#66d9ff", "#a6e3ff", "#33a3ff"];

  // ✅ Fetch list of regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CLIMATE_REGIONS());
        const data = await res.json();
        if (Array.isArray(data)) {
          setRegions(data);
        }
      } catch (err) {
        console.error("Error fetching regions:", err);
      }
    };
    fetchRegions();
  }, []);

  // ✅ Fetch event frequency
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_ENDPOINTS.CLIMATE_EVENTS(selectedRegion));
        if (!response.ok) throw new Error("Failed to fetch event data");
        const data = await response.json();

        const formattedData = Object.entries(data).map(([category, count]) => ({
          category,
          count,
        }));
        setEventData(formattedData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [selectedRegion]);

  // ✅ Fetch severity
  useEffect(() => {
    const fetchSeverityData = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CLIMATE_SEVERITY(selectedRegion));
        if (!res.ok) throw new Error("Failed to fetch severity data");

        const data = await res.json();
        const formatted = Object.entries(data).map(([name, value]) => ({ name, value }));
        setImpactData(formatted);
      } catch (err) {
        console.error("Error fetching severity data:", err);
      }
    };
    fetchSeverityData();
  }, [selectedRegion]);

  // 🧠 Generate AI summary whenever data changes
  useEffect(() => {
    const getAISummary = async () => {
      if (eventData.length === 0 && impactData.length === 0) return;
      setAiLoading(true);
      try {
        const summary = await generateAnalyticsSummary(selectedRegion, eventData, impactData);
        setAiSummary(summary);
      } catch (err) {
        console.error("Gemini summary error:", err);
        setAiSummary("AI summary unavailable.");
      } finally {
        setAiLoading(false);
      }
    };
    getAISummary();
  }, [selectedRegion, eventData, impactData]);

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Climate Analytics Dashboard</h1>
        <p>Explore data-driven insights about environmental events across British Columbia.</p>

        {/* Region Selector */}
        <div className="region-selector">
          <select
            id="region-select"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {regions.length > 0 ? (
              regions.map((r, i) => (
                <option key={i} value={r.name || r}>
                  {r.name || r}
                </option>
              ))
            ) : (
              <>
                <option value="Thompson-Okanagan">Thompson-Okanagan</option>
                <option value="Northern BC">Northern BC</option>
                <option value="Lower Mainland">Lower Mainland</option>
                <option value="Vancouver Island & Coast">Vancouver Island & Coast</option>
                <option value="Kootenay/Columbia">Kootenay/Columbia</option>
              </>
            )}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading analytics data...</p>
      ) : (
        <div className="analytics-grid">
          {/* Chart 1 */}
          <div className="chart-card">
            <h3>Event Frequency by Category ({selectedRegion})</h3>
            {eventData.length === 0 ? (
              <p>No event data available for this region.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" />
                  <XAxis dataKey="category" stroke="#b0b0b0" />
                  <YAxis stroke="#b0b0b0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e2a38",
                      border: "1px solid #3ebfff",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="count" fill="#3ebfff" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Chart 2 */}
          <div className="chart-card">
            <h3>Event Severity Distribution ({selectedRegion})</h3>
            {impactData.length === 0 ? (
              <p>No severity data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={impactData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#3ebfff"
                    dataKey="value"
                    label
                  >
                    {impactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e2a38",
                      border: "1px solid #3ebfff",
                      color: "white",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Quick Stats */}
          <div className="stats-card">
            <h3>Quick Statistics</h3>
            <ul>
              <li>
                <span>Total Recorded Events:</span>{" "}
                {eventData.reduce((sum, e) => sum + e.count, 0)}
              </li>
              <li>
                <span>Most Frequent Event Type:</span>{" "}
                {eventData.length
                  ? eventData.reduce((a, b) => (a.count > b.count ? a : b)).category
                  : "N/A"}
              </li>
              <li>
                <span>Selected Region:</span> {selectedRegion}
              </li>
              <li>
                <span>Data Updated:</span> November 2025
              </li>
            </ul>
          </div>

          {/* 🧠 Gemini AI Summary */}
          <div className="ai-summary">
            <h3>AI-Generated Insight</h3>
            {aiLoading ? <p>Generating summary...</p> : <p>{aiSummary}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
