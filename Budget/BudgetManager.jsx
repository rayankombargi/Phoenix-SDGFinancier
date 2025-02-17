// components/BudgetManager.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './BudgetManager.css';

const defaultBudgetLimits = {
  'Debts & Loans': '',
  'Savings & Investments': '',
  'Shopping & Lifestyle': '',
  'Food & Dining': '',
  'Health & Wellness': '',
  'Travel & Leisure': '',
  'Education & Self-Development': '',
  'Giving & Charity': '',
  'Other': '',
};

function BudgetManager({ onBudgetChange }) {
  const [budgetLimits, setBudgetLimits] = useState(defaultBudgetLimits);

  const handleInputChange = (e, category) => {
    const value = e.target.value;
    const updatedLimits = { ...budgetLimits, [category]: value };
    setBudgetLimits(updatedLimits);
    if (onBudgetChange) onBudgetChange(updatedLimits);
  };

  return (
    <motion.section 
      className="budget-manager"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h2 className="bm-title">Budget Manager</h2>
      <p className="bm-subtitle">
        Set your monthly budget limits for each category.
      </p>
      <div className="bm-inputs">
        {Object.keys(budgetLimits).map((category) => (
          <div key={category} className="bm-item">
            <label htmlFor={`budget-${category}`} className="bm-label">
              {category}
            </label>
            <input
              id={`budget-${category}`}
              type="number"
              className="bm-input"
              value={budgetLimits[category]}
              onChange={(e) => handleInputChange(e, category)}
              placeholder="Enter limit"
            />
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export default BudgetManager;
