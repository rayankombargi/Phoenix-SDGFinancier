import React from "react";
import "../../DashboardTheme.css";

const SummaryCards = ({ budget, sustainabilityScore, ecoPoints }) => {
  const summaryData = [
    { label: "Monthly Budget", value: `$${budget}`, color: "#FF9800" },
    {
      label: "Sustainability Score",
      value: `${sustainabilityScore}%`,
      color: "#4CAF50",
    },
    { label: "Eco-Points", value: ecoPoints, color: "#03A9F4" },
  ];

  return (
    <div className="summary-container">
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="summary-card"
          style={{ backgroundColor: item.color }}
        >
          <h4>{item.label}</h4>
          <p>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
