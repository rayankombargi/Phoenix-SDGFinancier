const express = require('express');
const router = express.Router();
const { Expense, Category } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

function computeSustainabilityScore(cost, categoryName, details, baseFactor) {
  let adjustedFactor = baseFactor;
  if (details && categoryName) {
    switch (categoryName) {
      case 'Debts & Loans':
        if (details.greenDebt === true) adjustedFactor *= 0.85;
        break;
      case 'Savings & Investments':
        if (details.greenInvestment === true) adjustedFactor *= 0.75;
        break;
      case 'Shopping & Lifestyle':
        if (details.sustainableBrand === true) adjustedFactor *= 0.80;
        break;
      case 'Food & Dining':
        if (details.organic === true) adjustedFactor *= 0.8;
        if (details.local === true) adjustedFactor *= 0.9;
        break;
      case 'Health & Wellness':
        if (details.naturalProducts === true) adjustedFactor *= 0.9;
        break;
      case 'Travel & Leisure':
        if (details.mode) {
          if (details.mode === 'public') {
            adjustedFactor *= 0.7;
          } else if (details.mode === 'carpool') {
            adjustedFactor *= 0.8;
          } else if (details.mode === 'electric') {
            adjustedFactor *= 0.75;
          }
        }
        break;
      case 'Education & Self-Development':
        if (details.online === true) adjustedFactor *= 0.85;
        break;
      case 'Giving & Charity':
        if (details.greenCharity === true) adjustedFactor *= 0.90;
        break;
      case 'Other':
      default:
        // No additional adjustments.
        break;
    }
  }
  return parseFloat((parseFloat(cost) * adjustedFactor).toFixed(2));
}

// GET /expenses - Retrieve all expenses for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    console.log(`Fetched ${expenses.length} expenses for user ${req.user.id}`);
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /expenses - Create a new expense
// Expects a JSON body with date, name, cost, category (name), and optional details.
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, name, cost, category, details } = req.body;
    // Look up the category by name.
    const foundCategory = await Category.findOne({ where: { name: category } });
    if (!foundCategory) {
      console.log(`Category "${category}" not found for user ${req.user.id}`);
      return res.status(400).json({ error: 'Category not found' });
    }
    // Get the category's base sustainability factor.
    const sustainabilityFactor = await foundCategory.getSustainabilityFactor();
    let baseFactor = sustainabilityFactor ? parseFloat(sustainabilityFactor.co2_factor) : 0;
    // Compute the expense sustainability score.
    const computedScore = computeSustainabilityScore(cost, category, details, baseFactor);
    
    // Create the expense record with the computed sustainability score.
    const expense = await Expense.create({
      userId: req.user.id,
      date,
      name,
      cost,
      category_id: foundCategory.id,
      details: details || {},
      sustainabilityScore: computedScore,
    });
    console.log(`Created expense ${expense.id} for user ${req.user.id} in category ${category} with sustainabilityScore ${computedScore}`);
    res.status(201).json(expense);
  } catch (err) {
    console.error('Error creating expense:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /expenses/:id - Update an expense by its ID and re-compute its sustainability score
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { date, name, cost, category, details } = req.body;
    // Find the category by name.
    const foundCategory = await Category.findOne({ where: { name: category } });
    if (!foundCategory) {
      console.log(`Category "${category}" not found for update by user ${req.user.id}`);
      return res.status(400).json({ error: 'Category not found' });
    }
    // Get the associated sustainability factor.
    const sustainabilityFactor = await foundCategory.getSustainabilityFactor();
    let baseFactor = sustainabilityFactor ? parseFloat(sustainabilityFactor.co2_factor) : 0;
    const computedScore = computeSustainabilityScore(cost, category, details, baseFactor);

    const updateData = { date, name, cost, category_id: foundCategory.id, sustainabilityScore: computedScore };
    if (details !== undefined) {
      updateData.details = details;
    }
    const [updated] = await Expense.update(updateData, { where: { id: req.params.id, userId: req.user.id } });
    if (updated) {
      const updatedExpense = await Expense.findByPk(req.params.id);
      console.log(`Updated expense ${req.params.id} for user ${req.user.id} with new sustainabilityScore ${computedScore}`);
      res.json(updatedExpense);
    } else {
      console.log(`Expense ${req.params.id} not found for user ${req.user.id}`);
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (err) {
    console.error('Error updating expense:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /expenses/:id - Delete an expense by its ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Expense.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (deleted) {
      console.log(`Deleted expense ${req.params.id} for user ${req.user.id}`);
      res.json({ message: 'Expense deleted' });
    } else {
      console.log(`Expense ${req.params.id} not found for deletion for user ${req.user.id}`);
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (err) {
    console.error('Error deleting expense:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
