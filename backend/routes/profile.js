const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /profile - Get authenticated user's profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /profile - Update authenticated user's profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, avatar, location, bio } = req.body;
    await User.update({ name, avatar, location, bio }, { where: { id: req.user.id } });
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] }
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
