// src/Dashboard/RewardBreakdown.jsx
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import './RewardBreakdown.css';
import { ExpensesContext } from '../contexts/ExpensesContext';

function RewardBreakdown() {
  // Pull rewardsPoints from ExpensesContext
  const { rewardsPoints } = useContext(ExpensesContext);

  // Keep your threshold the same
  const nextTierThreshold = 3000;
  const progressPercentage = Math.min(
    Math.round((rewardsPoints / nextTierThreshold) * 100),
    100
  );

  // Dummy recent reward activity data (or pull from your own data)
  const rewardEvents = [
    { id: 1, type: 'Eco Points', points: 100, date: '2025-02-15' },
    { id: 2, type: 'Cashback', points: 50, date: '2025-02-14' },
    { id: 3, type: 'Bonus Points', points: 25, date: '2025-02-13' },
  ];

  return (
    <motion.section
      className="reward-breakdown"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <p className="reward-subtitle">
        See your total rewards and progress toward the next tier.
      </p>

      <div className="reward-summary">
        <div className="total-rewards">
          <span className="label">Total Rewards</span>
          {/* Use rewardsPoints from context */}
          <span className="value">{rewardsPoints} pts</span>
        </div>
        <div className="reward-progress-bar">
          <div className="progress-bg">
            <motion.div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span className="progress-text">{progressPercentage}% to next tier</span>
        </div>
      </div>

      <div className="reward-events">
        <h3>Recent Reward Activity</h3>
        <ul className="events-list">
          {rewardEvents.map((event) => (
            <li key={event.id} className="event-item">
              <span className="event-type">{event.type}</span>
              <span className="event-points">+{event.points} pts</span>
              <span className="event-date">{event.date}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigate to /rewards when clicked */}
      <button
        className="redeem-button"
        onClick={() => {
          window.location.href = '/rewards';
          // Or use `useNavigate()` from react-router-dom:
          // const navigate = useNavigate();
          // navigate('/rewards');
        }}
      >
        Redeem Rewards
      </button>
    </motion.section>
  );
}

export default RewardBreakdown;
