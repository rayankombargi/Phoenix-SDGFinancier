const express = require('express');
const router = express.Router();
const { Expense, Category, SustainabilityFactor, SustainabilityMetric } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /sustainability - Retrieve sustainability metrics for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    let metric = await SustainabilityMetric.findOne({
      where: { user_id: req.user.id }
    });
    if (!metric) {
      metric = await SustainabilityMetric.create({ user_id: req.user.id });
    }
    res.json(metric);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /sustainability - Update sustainability metrics for the authenticated user manually
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { sustainability_score, eco_points } = req.body;
    let metric = await SustainabilityMetric.findOne({
      where: { user_id: req.user.id }
    });
    if (!metric) {
      metric = await SustainabilityMetric.create({
        user_id: req.user.id,
        sustainability_score: sustainability_score || 0,
        eco_points: eco_points || 0,
        last_updated: new Date()
      });
    } else {
      if (sustainability_score !== undefined) {
        metric.sustainability_score = sustainability_score;
      }
      if (eco_points !== undefined) {
        metric.eco_points = eco_points;
      }
      metric.last_updated = new Date();
      await metric.save();
    }
    res.json(metric);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /sustainability/compute - Compute sustainability metrics based on user's expenses and sustainability factors
router.post('/compute', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // Retrieve all expenses for the user along with their categories and associated sustainability factors.
    const expenses = await Expense.findAll({
      where: { user_id: userId },
      include: [{
        model: Category,
        as: 'category',
        include: [{
          model: SustainabilityFactor,
          as: 'sustainabilityFactor'
        }]
      }]
    });

    // Compute total CO₂ impact from expenses.
    let totalCO2Impact = 0;
    expenses.forEach(expense => {
      const cost = parseFloat(expense.cost);
      const factor = expense.category && expense.category.sustainabilityFactor 
        ? parseFloat(expense.category.sustainabilityFactor.co2_factor)
        : 0;
      totalCO2Impact += cost * factor;
    });

    // For example, a basic formula for a sustainability score:
    // Higher spending with high CO₂ impact lowers the score.
    // Here, we assume a base score of 100 and subtract a fraction of the total impact.
    const score = Math.max(100 - (totalCO2Impact / 10), 0).toFixed(2);
    // Eco points could be computed similarly; here, we subtract the impact from a base value.
    const ecoPoints = Math.max(1000 - totalCO2Impact, 0);

    // Update or create the user's sustainability metric record.
    let metric = await SustainabilityMetric.findOne({ where: { user_id: userId } });
    if (!metric) {
      metric = await SustainabilityMetric.create({
        user_id: userId,
        sustainability_score: score,
        eco_points: ecoPoints,
        last_updated: new Date()
      });
    } else {
      metric.sustainability_score = score;
      metric.eco_points = ecoPoints;
      metric.last_updated = new Date();
      await metric.save();
    }

    res.json(metric);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
