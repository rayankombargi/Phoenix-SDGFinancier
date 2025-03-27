// server/routes/questions.js
const express = require('express');
const router = express.Router();
const { Category, SustainabilityQuestion } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /questions?category=CategoryName
router.get('/', authMiddleware, async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ error: 'Category required' });
  }

  // Find the category record by name.
  const foundCategory = await Category.findOne({ where: { name: category } });
  if (!foundCategory) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Retrieve questions associated with that category.
  const questions = await SustainabilityQuestion.findAll({
    where: { category_id: foundCategory.id },
    attributes: ['id', ['question_text', 'text'], ['possible_answers', 'answers']],
    order: [['createdAt', 'ASC']]
  });
  res.json(questions);
});

module.exports = router;
