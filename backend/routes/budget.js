const express = require('express');
const router = express.Router();
const { Budget } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /budget?month=3&year=2025 - Retrieve budget settings for a specific month/year
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    // Default to current month/year if not provided
    const now = new Date();
    const m = month ? parseInt(month) : now.getMonth() + 1;
    const y = year ? parseInt(year) : now.getFullYear();

    const budgets = await Budget.findAll({
      where: {
        userId: req.user.id,
        month: m,
        year: y,
      },
    });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /budget - Update or create budget settings for a given month/year
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { month, year, budgets } = req.body;
    if (!month || !year || !budgets || !Array.isArray(budgets)) {
      return res.status(400).json({ error: "Invalid payload. Expect month, year, and budgets array." });
    }

    // Process each budget setting
    const updatedBudgets = await Promise.all(budgets.map(async (item) => {
      const [budget, created] = await Budget.findOrCreate({
        where: {
          userId: req.user.id,
          month: month,
          year: year,
          category: item.category,
        },
        defaults: {
          limit: item.limit,
        },
      });
      if (!created) {
        // Update the limit if the entry exists
        budget.limit = item.limit;
        await budget.save();
      }
      return budget;
    }));

    res.json(updatedBudgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
