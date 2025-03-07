import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ExpensesManager.css';
import AddExpense from './AddExpense';
import EditExpense from './EditExpense';
import { ExpensesContext } from '../contexts/ExpensesContext';

function ExpensesManager({ onExpensesChange }) {
  const { expenses, setExpenses } = useContext(ExpensesContext);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('Date');
  const [sortOrder] = useState('Descending');
  const [currentPage, setCurrentPage] = useState(1);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [searchedExpense, setSearched] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const itemsPerPage = 10;

  const handleAddExpense = () => {
    setIsAdding(true);
  }

  const handleAddSave = (AddedExpense) => {
    const updatedExpenses = [...expenses, AddedExpense];
    setExpenses(updatedExpenses);
    setIsAdding(false);
    if (onExpensesChange) onExpensesChange(updatedExpenses);
  }

  const handleAddCancel = () => {
    setIsAdding(false);
  }

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
    setExpenseToEdit(null);
  };

  const handleSortChange = (e) => {
    setSortFilter(e.target.value);
    setCurrentPage(1);
    const sortedExpenses = [...expenses];
    switch (e.target.value) {
      case 'Date':
      sortedExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
      case 'Name':
      sortedExpenses.sort((a, b) => a.name.localeCompare(b.name));
      break;
      case 'Cost':
      sortedExpenses.sort((a, b) => a.cost - b.cost);
      break;
      case 'Category':
      sortedExpenses.sort((a, b) => a.category.localeCompare(b.category));
      break;
      default:
      break;
    }

    if (sortOrder === 'Descending') {
      sortedExpenses.reverse();
    }
    setExpenses(sortedExpenses);
  }

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const searchedExpenses = searchedExpense === '' ? expenses : expenses.filter((exp) => exp.name.toLowerCase().includes(searchedExpense.toLowerCase()));

  const filteredExpenses =
    categoryFilter === 'All'
      ? searchedExpenses
      : searchedExpenses.filter((exp) => exp.category === categoryFilter);

  const totalPages =
    filteredExpenses.length === 0 ? 0 : Math.ceil(filteredExpenses.length / itemsPerPage);

  const currentExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = (e) => {
    setSearched(e.target.value);
  }

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
      <div className='filters'>
        <div className="sort">
          <label htmlFor="sort-filter">Sort by:</label>
          <select id="sort-filter" value={sortFilter} onChange={handleSortChange}>
            <option value="Date">Date</option>
            <option value="Name">Name</option>
            <option value="Cost">Cost</option>
            <option value="Category">Category</option>
          </select>
        </div>
        <div className="sortOrder">
          <label htmlFor="sortOrder-filter">Sort order:</label>
          <select id="sortOrder-filter" value={sortFilter} onChange={handleSortChange}>
            <option value="Descending">Descending</option>
            <option value="Ascending">Ascending</option>
          </select>
        </div>
        <div className="category">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select id="category-filter" value={categoryFilter} onChange={handleCategoryChange}>
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
      </div>

      <div className='Search'>
        <input className='searchedExpense' type="text" placeholder="Search expenses" value = {searchedExpense} onChange={handleChange} />
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
                  <button className="edit-btn" onClick={() => handleEditExpense(expense.id)}>
                    Edit
                  </button>
                  <button className="remove-btn" onClick={() => handleRemoveExpense(expense.id)}>
                    Remove
                  </button>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
        {currentExpenses.length === 0 ? (
          <div className="no-expenses">No expenses to display</div>
        ) : null}
      </div>

      <div className='add-expense'>
        <button className="add-btn" onClick={() => handleAddExpense()}>
          New
        </button>

      </div>

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          {totalPages === 0 ? 'Page 0 of 0' : `Page ${currentPage} of ${totalPages}`}
        </span>
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
        { isAdding && (
          <AddExpense
            onAdd={handleAddSave}
            onCancel={handleAddCancel}
          />
        )
        }
      </AnimatePresence>
    </motion.section>
  );
}

export default ExpensesManager;
