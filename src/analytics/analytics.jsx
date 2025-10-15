import React from "react";
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
  // Sample analytics data (you can replace these with dynamic values)
  const eventData = [
    { category: "Wildfire", count: 25 },
    { category: "Flood", count: 18 },
    { category: "Heatwave", count: 12 },
    { category: "Oil Spill", count: 6 },
    { category: "Landslide", count: 8 },
    { category: "Drought", count: 10 },
  ];

  const impactData = [
    { name: "High Impact", value: 35 },
    { name: "Moderate Impact", value: 20 },
    { name: "Low Impact", value: 14 },
  ];

  const COLORS = ["#3ebfff", "#66d9ff", "#a6e3ff"];

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Climate Analytics Dashboard</h1>
        <p>
          Explore data-driven insights about environmental events across British Columbia.
        </p>
      </div>

      <div className="analytics-grid">
        {/* Chart 1 - Bar Chart for Event Frequency */}
        <div className="chart-card">
          <h3>Event Frequency by Category</h3>
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
        </div>

        {/* Chart 2 - Pie Chart for Impact Distribution */}
        <div className="chart-card">
          <h3>Event Impact Distribution</h3>
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
        </div>

        {/* Chart 3 - Summary Stats */}
        <div className="stats-card">
          <h3>Quick Statistics</h3>
          <ul>
            <li><span>Total Recorded Events:</span> 79</li>
            <li><span>Most Frequent Event Type:</span> Wildfire</li>
            <li><span>Highest Impact Region:</span> Interior BC</li>
            <li><span>Average Events per Year:</span> 15+</li>
            <li><span>Data Updated:</span> October 2025</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
