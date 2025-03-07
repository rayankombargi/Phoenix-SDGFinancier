const express = require('express');
const router = express.Router();
const { Reward } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /rewards - Get all reward events for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rewards = await Reward.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /rewards/total - Get total reward points for the user
router.get('/total', authMiddleware, async (req, res) => {
  try {
    const rewards = await Reward.findAll({
      where: { userId: req.user.id },
    });
    const totalPoints = rewards.reduce((sum, reward) => sum + reward.points, 0);
    res.json({ totalPoints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /rewards - Create a new reward event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, points, date } = req.body;
    const reward = await Reward.create({
      userId: req.user.id,
      type,
      points,
      date: date || new Date(),
    });
    res.status(201).json(reward);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
