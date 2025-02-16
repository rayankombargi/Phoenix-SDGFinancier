import SummaryCards from "./components/DashboardComponents/summaryCards";
import Charts from "./components/DashboardComponents/charts";
import BudgetProgress from "./components/DashboardComponents/BudgetProgress";
import Transactions from "./components/DashboardComponents/Transactions";
import React, { useState, useEffect } from "react";
const Dashboard = () => {
  const [points, setPoints] = useState(300);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const newRewards = [];
    if (points >= 50)
      newRewards.push({
        text: "10% Discount on Eco-Friendly Products",
        cost: 50,
      });
    if (points >= 100)
      newRewards.push({ text: "Free Sustainable Shopping Bag", cost: 100 });
    if (points >= 200)
      newRewards.push({
        text: "Exclusive Access to SDG Finance Events",
        cost: 200,
      });

    setRewards(newRewards);
  }, [points]);

  const handleRedeemReward = (cost) => {
    if (points >= cost) {
      setPoints(points - cost);
      alert("Reward Redeemed Successfully!");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1 className="logo">SDG Finance</h1>
        <nav>
          <ul className="nav-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/dashboard" className="active">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/budget">Budget</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
          </ul>
        </nav>
      </header>

      <div className="dashboard-content">
        <SummaryCards
          budget={5000}
          sustainabilityScore={78}
          ecoPoints={points}
        />
        <section className="dashboard-section">
          <div className="budget-progress-container">
            <BudgetProgress budgetUsed={2500} totalBudget={5000} />
          </div>
          <div className="transactions-container">
            <Transactions />
          </div>
        </section>

        {<Charts />}

        {/* Rewards Section */}
        <div className="rewards-container">
          <h3>Rewards Earned</h3>
          {rewards.length > 0 ? (
            <div className="rewards-list">
              {rewards.map((reward, index) => (
                <button
                  key={index}
                  className={`reward-button ${
                    points >= reward.cost ? "active" : "disabled"
                  }`}
                  onClick={() => handleRedeemReward(reward.cost)}
                  disabled={points < reward.cost}
                >
                  {reward.text} ({reward.cost} Points)
                </button>
              ))}
            </div>
          ) : (
            <p className="no-rewards">
              No rewards yet, keep shopping sustainably!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
