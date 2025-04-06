const express = require('express');
const router = express.Router();
const { Expense, Category, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Recomputes the user's total points by summing all of their expenses
async function recalcUserPoints(userId) {
  const userExpenses = await Expense.findAll({ where: { userId } });
  const total = userExpenses.reduce((sum, e) => sum + Math.round(e.sustainabilityScore || 0), 0);

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found during point recalculation`);
  }
  user.points = total;
  await user.save();
  return user.points;
}

// The logic for computing the sustainability score
function computeSustainabilityScore(cost, categoryName, details, baseFactor = 1) {
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
        if (details.organic === true) adjustedFactor *= 0.80;
        if (details.local === true) adjustedFactor *= 0.90;
        break;
      case 'Health & Wellness':
        if (details.naturalProducts === true) adjustedFactor *= 0.90;
        break;
      case 'Travel & Leisure':
        if (details.mode === 'public') {
          adjustedFactor *= 0.70;
        } else if (details.mode === 'carpool') {
          adjustedFactor *= 0.80;
        } else if (details.mode === 'electric') {
          adjustedFactor *= 0.75;
        }
        break;
      case 'Education & Self-Development':
        if (details.online === true) adjustedFactor *= 0.85;
        break;
      case 'Giving & Charity':
        if (details.greenCharity === true) adjustedFactor *= 0.90;
        break;
      default:
        break;
    }
  }
  const score = parseFloat((parseFloat(cost) * adjustedFactor).toFixed(2));
  return score;
}

// GET /expenses - Retrieve all expenses for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ]
    });
    console.log(`Fetched ${expenses.length} expenses for user ${req.user.id}`);
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /expenses - Create a new expense, compute score, update user.points
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, name, cost, category, details } = req.body;
    if (!date || !name || !cost || !category) {
      return res.status(400).json({ error: 'Date, name, cost, and category are required.' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const foundCategory = await Category.findOne({ where: { name: category } });
    if (!foundCategory) {
      console.log(`Category "${category}" not found for user ${req.user.id}`);
      return res.status(400).json({ error: 'Category not found' });
    }

    const sustainabilityFactor = await foundCategory.getSustainabilityFactor();
    const baseFactor = sustainabilityFactor ? parseFloat(sustainabilityFactor.co2_factor) : 1;
    const computedScore = computeSustainabilityScore(cost, category, details, baseFactor);

    const newExpense = await Expense.create({
      userId: user.id,
      date,
      name,
      cost,
      category_id: foundCategory.id,
      details: details || {},
      sustainabilityScore: computedScore,
    });

    // Recompute user points from all expenses
    await recalcUserPoints(user.id);

    // Fetch the newly created expense, including category name
    const createdExpense = await Expense.findByPk(newExpense.id, {
      include: [{ model: Category, as: 'category', attributes: ['name'] }]
    });

    res.status(201).json(createdExpense);
  } catch (err) {
    console.error('Error creating expense:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /expenses/:id - Update expense, re-compute user points
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { date, name, cost, category, details } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const foundCategory = await Category.findOne({ where: { name: category } });
    if (!foundCategory) {
      return res.status(400).json({ error: 'Category not found' });
    }

    const sustainabilityFactor = await foundCategory.getSustainabilityFactor();
    const baseFactor = sustainabilityFactor ? parseFloat(sustainabilityFactor.co2_factor) : 1;
    const computedScore = computeSustainabilityScore(cost, category, details, baseFactor);

    const updateData = {
      date,
      name,
      cost,
      category_id: foundCategory.id,
      sustainabilityScore: computedScore
    };
    if (details !== undefined) {
      updateData.details = details;
    }

    const [updated] = await Expense.update(updateData, {
      where: { id: req.params.id, userId: user.id }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Expense not found or not yours' });
    }

    // Recompute user points from all expenses
    await recalcUserPoints(user.id);

    const updatedExpense = await Expense.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['name'] }]
    });

    res.json(updatedExpense);
  } catch (err) {
    console.error('Error updating expense:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /expenses/:id - Delete expense, re-compute user points
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deleted = await Expense.destroy({
      where: { id: req.params.id, userId: user.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Expense not found or not yours' });
    }

    // Recompute user points
    await recalcUserPoints(user.id);

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error('Error deleting expense:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
