const express = require('express');
const router = express.Router();
const { Expense } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /expenses - Retrieve all expenses for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /expenses - Create a new expense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, name, cost, category } = req.body;
    const expense = await Expense.create({
      userId: req.user.id,
      date,
      name,
      cost,
      category
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /expenses/:id - Update an expense
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { date, name, cost, category } = req.body;
    const [updated] = await Expense.update(
      { date, name, cost, category },
      { where: { id: req.params.id, userId: req.user.id } }
    );
    if (updated) {
      const updatedExpense = await Expense.findByPk(req.params.id);
      res.json(updatedExpense);
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /expenses/:id - Delete an expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Expense.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (deleted) {
      res.json({ message: 'Expense deleted' });
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
