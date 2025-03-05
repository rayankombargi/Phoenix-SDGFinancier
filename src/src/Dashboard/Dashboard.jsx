// pages/Dashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import SummaryCards from '../components/SummaryCards';
import SpendingChart from './SpendingChart';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import RecentTransactions from './RecentTransactions';
import RewardBreakdown from './RewardBreakdown';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <NavBar />
      <motion.main
        className="dashboard-content" // Removed "container" to avoid big side margins
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <header className="dashboard-header">
          <h1>Budget Dashboard</h1>
          <p>Overview of your financial health, spending trends, and rewards</p>
        </header>

        <section className="summary-section">
          <SummaryCards />
        </section>

        <section className="charts-section">
          <div className="chart-container">
            <h2>Spending Trends</h2>
            <SpendingChart />
          </div>
          <div className="chart-container">
            <h2>Category Breakdown</h2>
            <CategoryBreakdownChart />
          </div>
        </section>

        <section className="transactions-section">
          <h2>Recent Transactions</h2>
          <RecentTransactions />
        </section>

        <section className="rewards-section">
          <h2>Reward Breakdown</h2>
          <RewardBreakdown />
        </section>
      </motion.main>
    </div>
  );
}

export default Dashboard;
