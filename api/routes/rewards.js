const express = require('express');
const router = express.Router();
const { Reward, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Get rewards
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rewards = await Reward.findAll();
    res.json(rewards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching rewards' });
  }
});

// Redeem reward
router.post('/redeem', authMiddleware, async (req, res) => {
  const { rewardId } = req.body;

  try {
    const reward = await Reward.findByPk(rewardId);
    const user = await User.findByPk(req.user.id);

    if (!reward) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }

    if (user.points < reward.points) {
      return res.status(400).json({ success: false, message: 'Not enough points' });
    }

    user.points -= reward.points;
    await user.save();

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    return res.json({ success: true, newPoints: user.points, code });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal error redeeming reward' });
  }
});

module.exports = router;
