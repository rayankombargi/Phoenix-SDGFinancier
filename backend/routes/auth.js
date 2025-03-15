const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// POST /auth/signup - Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    // Create a new user; the password is stored in passwordHash (hashed in the model hook)
    const user = await User.create({
      username,
      email,
      passwordHash: password,
      name,
    });
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ error: error.message });
  }
});

// POST /auth/login - Authenticate user and return a JWT token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Verify password
    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate JWT token with a 1-hour expiry
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
