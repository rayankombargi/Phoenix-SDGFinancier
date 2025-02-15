import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './budgetThemes.css';
import { useLocation } from 'react-router-dom';

function Expenses() {
    const location = useLocation();
    const initialExpenses = location.state?.expenses || [];
    const [expenses, setExpenses] = useState(initialExpenses);
    const [category, setCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleRemoveExpense = (indexToRemove) => {
        setExpenses(expenses.filter((_, index) => index !== indexToRemove));
    };

    const handleEditExpense = (indexToEdit) => {
        setExpenses(expenses.map((expense, index) => {
            if (index === indexToEdit) {
                return {
                    ...expense,
                    name: prompt('Enter new name', expense.name),
                    cost: prompt('Enter new cost', expense.cost),
                    month: prompt('Enter new month', expense.month),
                    day: prompt('Enter new day', expense.day),
                    year: prompt('Enter new year', expense.year)
                };
            }
            return expense;
        }));
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setCurrentPage(1); // Reset to first page when category changes
    };

    const filteredExpenses = category === 'All'
        ? expenses
        : expenses.filter(expense => expense.category === category);

    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    const currentExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const [budgetLimits, setBudgetLimits] = useState({
        'Debts & Loans': 0,
        'Savings & Investments': 0,
        'Shopping & Lifestyle': 0,
        'Food & Dining': 0,
        'Health & Wellness': 0,
        'Travel & Leisure': 0,
        'Education & Self-Development': 0,
        'Giving & Charity': 0,
        'Other': 0
    });

    const handleBudgetChange = (event, category) => {
        setBudgetLimits({
            ...budgetLimits,
            [category]: event.target.value
        });
    };

    return (
        <div>
            <NavBar />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="BudgetManager">
                    <h1>Budget</h1>
                    <div className='budgetLimitDescription'>
                        <label>Enter the budget limit for each category</label>
                    </div>
                    <div className="budgetInputs">
                        {Object.keys(budgetLimits).map((category) => (
                            <div key={category} className="budget">
                                <label className='budgetLabel' htmlFor={`budget-${category}`}>{category}:</label>
                                <input className='budgetInput'
                                    type="number"
                                    id={`budget-${category}`}
                                    value={budgetLimits[category]}
                                    onChange={(event) => handleBudgetChange(event, category)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="dataExpenses">
                    <h1>Expenses</h1>
                    <div className="categoryFilter">
                        <label htmlFor="category">Category:</label>
                        <select id="category" value={category} onChange={handleCategoryChange}>
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
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Cost ($)</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentExpenses.map((expense, index) => (
                                <tr key={index}>
                                    <td>{expense.name}</td>
                                    <td>{expense.cost}</td>
                                    <td>{expense.month}/{expense.day}/{expense.year}</td>
                                    <td>{expense.category}</td>
                                    <td className='ManageButtons'>
                                        <button className='EditButton' type='button' onClick={() => handleEditExpense(index)}>
                                            Edit
                                        </button>
                                        <button className='RemoveButton' type='button' onClick={() => handleRemoveExpense(index)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </div>
            </motion.div>
            <Footer />
        </div>
    );
}

export default Expenses;