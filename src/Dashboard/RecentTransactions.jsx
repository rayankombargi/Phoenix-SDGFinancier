// components/RecentTransactions.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './RecentTransactions.css';

// Dummy data for recent transactions
const dummyTransactions = [
  { id: 1, date: '2025-02-12', name: 'Groceries', amount: 200, category: 'Food & Dining' },
  { id: 2, date: '2025-02-11', name: 'Loan Payment', amount: 300, category: 'Debts & Loans' },
  { id: 3, date: '2025-02-10', name: 'Restaurant', amount: 75, category: 'Food & Dining' },
  { id: 4, date: '2025-02-09', name: 'Cinema', amount: 50, category: 'Travel & Leisure' },
  { id: 5, date: '2025-02-08', name: 'Book Purchase', amount: 20, category: 'Education & Self-Development' },
];

// Variants for staggered row entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

function RecentTransactions() {
  return (
    <motion.section
      className="recent-transactions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >

      <div className="transactions-container">
        <motion.table
          className="transactions-table"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <thead>
            <tr className="transactions-row header-row">
              <th className="transaction-cell">Date</th>
              <th className="transaction-cell">Transaction</th>
              <th className="transaction-cell">Amount ($)</th>
              <th className="transaction-cell">Category</th>
            </tr>
          </thead>
          <motion.tbody>
            {dummyTransactions.map((transaction) => (
              <motion.tr
                key={transaction.id}
                className="transactions-row"
                variants={rowVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <td className="transaction-cell">{transaction.date}</td>
                <td className="transaction-cell">{transaction.name}</td>
                <td className="transaction-cell">{transaction.amount}</td>
                <td className="transaction-cell">{transaction.category}</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </motion.table>
      </div>
    </motion.section>
  );
}

export default RecentTransactions;
