import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../../DashboardTheme.css";

const spendingData = [
  { month: "Jan", amount: 400 },
  { month: "Feb", amount: 600 },
  { month: "Mar", amount: 350 },
  { month: "Apr", amount: 500 },
];

const categoryData = [
  { name: "Food", value: 300, color: "#FF5722" },
  { name: "Utilities", value: 200, color: "#66bb6a" },
  { name: "Leisure", value: 150, color: "#6c5ce7" },
];

const Charts = () => {
  return (
    <div className="charts-container">
      {/* Spending Trends */}
      <div className="chart-card">
        <h3>Spending Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={spendingData}>
            <XAxis dataKey="month" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#FFEB3B"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Spending Breakdown */}
      <div className="chart-card">
        <h3>Spending Breakdown</h3>
        <PieChart width={250} height={250}>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default Charts;
