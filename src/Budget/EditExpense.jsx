import React, {useState} from 'react';
import {motion} from 'framer-motion';
import './EditExpense.css';

function EditExpense({initialData, onSave, onCancel}) {
      const [formData, setFormData] = useState({
        id: initialData.id,
        date: initialData.date,
        name: initialData.name,
        cost: initialData.cost,
        category: initialData.category,
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
      };

    return (
        <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        >
        <motion.div 
            className="modal-content"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
        >
            <h2>Edit Expense</h2>
            <form onSubmit={handleSubmit}>
            <label>
                Date:
                <input 
                name="date" 
                type="text" 
                value={formData.date} 
                onChange={handleChange} 
                />
            </label>
            <label>
                Name:
                <input 
                name="name" 
                type="text" 
                value={formData.name} 
                onChange={handleChange} 
                />
            </label>
            <label>
                Cost:
                <input 
                name="cost" 
                type="text" 
                value={formData.cost} 
                onChange={handleChange} 
                />
            </label>
            <label>
                Category:
                <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                >
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
            </label>
            <div className="actions">
                <button className='save-btn' type="submit" disabled = {
                    !formData.date || !formData.name || !formData.cost || !formData.category || formData.cost < 0 || isNaN(formData.cost)
                }>Save</button>
                <button className='cancel-btn' type="button" onClick={onCancel}>Cancel</button>
            </div>
            </form>
        </motion.div>
        </motion.div>
    );
}

export default EditExpense;
