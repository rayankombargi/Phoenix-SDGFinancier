// src/Budget/BudgetPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import BudgetManager from './BudgetManager';
import ExpensesManager from './ExpensesManager';
import './BudgetPage.css';

function BudgetPage() {
  return (
    <div className="budget-page">
      <NavBar />
      <motion.main
        className="budget-page-content container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <header className="budget-page-header">
          <h1>Budget Overview</h1>
          <p>Manage your limits and review expenses for better financial control.</p>
        </header>

        <section className="manager-section">
          <h2>Set Your Budget Limits</h2>
          <BudgetManager />
        </section>

        <section className="expenses-section">
          <h2>Expenses</h2>
          <ExpensesManager />
        </section>
      </motion.main>

    </div>
  );
}

export default BudgetPage;
