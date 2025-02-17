// components/ExpensesManager.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence} from 'framer-motion';
import './ExpensesManager.css';
import EditExpense from './EditExpense'

// Dummy data for demonstration
const dummyExpenses = [
  { id: 1, name: 'Groceries', cost: 120, date: '2025-02-10', category: 'Food & Dining' },
  { id: 2, name: 'Loan Payment', cost: 300, date: '2025-02-11', category: 'Debts & Loans' },
  { id: 3, name: 'Restaurant', cost: 60, date: '2025-02-11', category: 'Food & Dining' },
  { id: 4, name: 'Cinema', cost: 50, date: '2025-02-12', category: 'Travel & Leisure' },
  { id: 5, name: 'Textbooks', cost: 100, date: '2025-02-12', category: 'Education & Self-Development' },
];

function ExpensesManager({ initialExpenses = dummyExpenses, onExpensesChange }) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [expenseToEdit, setExpenseToEdit] = useState(null)
  const itemsPerPage = 10;

  // Remove expense by ID

  const [isEditing, setIsEditing] = useState(false);

  const handleRemoveExpense = (id) => {
    const updated = expenses.filter((exp) => exp.id !== id);
    setExpenses(updated);
    if (onExpensesChange) onExpensesChange(updated);
  };

  const handleEditExpense = (id) => {
    const expense = expenses.find((exp) => exp.id === id);
    setExpenseToEdit(expense);
    setIsEditing(true);
  };

  const handleEditSave = (updatedExpense) => {
    const updatedExpenses = expenses.map((exp) => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    );
    setExpenses(updatedExpenses);
    setIsEditing(false);
    setExpenseToEdit(null);
    if (onExpensesChange) onExpensesChange(updatedExpenses);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setExpenseToEdit(null)
  };

  // Filter logic
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  // Filtered and paginated data
  const filteredExpenses = categoryFilter === 'All'
    ? expenses
    : expenses.filter((exp) => exp.category === categoryFilter);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const currentExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination controls
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <motion.section
      className="expenses-manager"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="filter">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={handleCategoryChange}
        >
          <option value="All">All</option>
          <option value="Debts & Loans">Debts & Loans</option>
          <option value="Savings & Investments">Savings & Investments</option>
          <option value="Shopping & Lifestyle">Shopping & Lifestyle</option>
          <option value="Food & Dining">Food & Dining</option>
          <option value="Health & Wellness">Health & Wellness</option>
          <option value="Travel & Leisure">Travel & Leisure</option>
          <option value="Education & Self-Development">Education & Self-Development</option>
          <option value="Giving & Charity">Giving & Charity</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="expenses-table">
          <thead>
            <tr className="table-header-row">
              <th>Date</th>
              <th>Name</th>
              <th>Cost ($)</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <motion.tbody>
            {currentExpenses.map((expense) => (
              <motion.tr
                key={expense.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="expense-row"
              >
                <td>{expense.date}</td>
                <td>{expense.name}</td>
                <td>{expense.cost}</td>
                <td>{expense.category}</td>
                <td className="row-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditExpense(expense.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveExpense(expense.id)}
                  >
                    Remove
                  </button>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <AnimatePresence>
        {isEditing && (
          <EditExpense
            initialData={expenseToEdit}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default ExpensesManager;
