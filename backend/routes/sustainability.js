const express = require('express');
const router = express.Router();

const { 
  Expense, 
  Category, 
  SustainabilityFactor, 
  SustainabilityMetric, 
  ExpenseAnswer, 
  SustainabilityQuestion 
} = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Helper function to adjust the base factor using normalized survey answers.
function adjustFactorWithAnswers(baseFactor, answers) {
  let adjustedFactor = baseFactor;
  if (answers && answers.length > 0) {
    answers.forEach(answerRecord => {
      const questionText = answerRecord.question && answerRecord.question.question_text
        ? answerRecord.question.question_text.toLowerCase()
        : "";
      const answer = answerRecord.answer.toLowerCase();
      // Example adjustments based on question text and answer.
      if (questionText.includes("organic") && answer === "yes") {
        adjustedFactor *= 0.8;
      }
      if (questionText.includes("locally sourced") && answer === "yes") {
        adjustedFactor *= 0.9;
      }
      if (questionText.includes("green debt") && answer === "yes") {
        adjustedFactor *= 0.85;
      }
      if (questionText.includes("green investment") && answer === "yes") {
        adjustedFactor *= 0.75;
      }
      if (questionText.includes("sustainable brand") && answer === "yes") {
        adjustedFactor *= 0.80;
      }
      if (questionText.includes("natural products") && answer === "yes") {
        adjustedFactor *= 0.9;
      }
      if (questionText.includes("mode of travel") && answer === "public") {
        adjustedFactor *= 0.7;
      }
      if (questionText.includes("mode of travel") && answer === "carpool") {
        adjustedFactor *= 0.8;
      }
      if (questionText.includes("mode of travel") && answer === "electric") {
        adjustedFactor *= 0.75;
      }
      if (questionText.includes("online course") && answer === "yes") {
        adjustedFactor *= 0.85;
      }
      if (questionText.includes("green charity") && answer === "yes") {
        adjustedFactor *= 0.90;
      }
    });
  }
  return adjustedFactor;
}

// GET /sustainability - Retrieve sustainability metrics for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    let metric = await SustainabilityMetric.findOne({ where: { userId: req.user.id } });
    if (!metric) {
      metric = await SustainabilityMetric.create({ userId: req.user.id });
    }
    res.json(metric);
  } catch (err) {
    console.error('GET /sustainability error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /sustainability - Update sustainability metrics manually for the authenticated user
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { sustainabilityScore, ecoPoints } = req.body;
    let metric = await SustainabilityMetric.findOne({ where: { userId: req.user.id } });
    if (!metric) {
      metric = await SustainabilityMetric.create({
        userId: req.user.id,
        sustainabilityScore: sustainabilityScore || 0,
        ecoPoints: ecoPoints || 0,
        lastUpdated: new Date()
      });
    } else {
      if (sustainabilityScore !== undefined) {
        metric.sustainabilityScore = sustainabilityScore;
      }
      if (ecoPoints !== undefined) {
        metric.ecoPoints = ecoPoints;
      }
      metric.lastUpdated = new Date();
      await metric.save();
    }
    res.json(metric);
  } catch (err) {
    console.error('PUT /sustainability error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /sustainability/compute - Compute sustainability metrics based on user's expenses and survey answers.
router.post('/compute', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // Retrieve all expenses for the user, including associated category, sustainability factor, and normalized answers.
    const expenses = await Expense.findAll({
      where: { userId },
      include: [
        {
          model: Category,
          as: 'category',
          include: [{
            model: SustainabilityFactor,
            as: 'sustainabilityFactor'
          }]
        },
        {
          model: ExpenseAnswer,
          as: 'answers',
          include: [{
            model: SustainabilityQuestion,
            as: 'question'
          }]
        }
      ]
    });

    console.log(`Found ${expenses.length} expenses for user ${userId}`);
    let totalCO2Impact = 0;

    expenses.forEach(expense => {
      const cost = parseFloat(expense.cost);
      if (isNaN(cost)) {
        console.warn(`Expense ${expense.id} has invalid cost: ${expense.cost}`);
        return;
      }
      // Get the base CO₂ factor from the category's SustainabilityFactor.
      let baseFactor = (expense.category && expense.category.sustainabilityFactor)
        ? parseFloat(expense.category.sustainabilityFactor.co2_factor)
        : 0;
      if (isNaN(baseFactor)) baseFactor = 0;

      console.log(`Expense ${expense.id}: category = ${expense.category ? expense.category.name : 'N/A'}, baseFactor = ${baseFactor}`);

      // Adjust factor using normalized survey answers.
      let adjustedFactor = adjustFactorWithAnswers(baseFactor, expense.answers);
      
      // Fallback: if no normalized answers exist and details are provided, use fallback logic.
      if ((!expense.answers || expense.answers.length === 0) && expense.details) {
        if (expense.category && expense.category.name === 'Food & Dining') {
          if (expense.details.organic === true) adjustedFactor *= 0.8;
          if (expense.details.local === true) adjustedFactor *= 0.9;
        }
        // Add fallback logic for other categories if needed.
      }
      
      console.log(`Expense ${expense.id}: adjusted factor = ${adjustedFactor}, cost = ${cost}`);
      const expenseScore = parseFloat((cost * adjustedFactor).toFixed(2));
      console.log(`Expense ${expense.id}: computed sustainability score = ${expenseScore}`);
      totalCO2Impact += expenseScore;
    });

    console.log(`Total CO₂ impact: ${totalCO2Impact}`);
    // Compute aggregated metrics for the user.
    const score = parseFloat(Math.max(100 - (totalCO2Impact / 10), 0).toFixed(2));
    const ecoPoints = Math.floor(Math.max(1000 - totalCO2Impact, 0));

    let metric = await SustainabilityMetric.findOne({ where: { userId } });
    if (!metric) {
      metric = await SustainabilityMetric.create({
        userId,
        sustainabilityScore: score,
        ecoPoints: ecoPoints,
        lastUpdated: new Date()
      });
    } else {
      metric.sustainabilityScore = score;
      metric.ecoPoints = ecoPoints;
      metric.lastUpdated = new Date();
      await metric.save();
    }

    res.json(metric);
  } catch (error) {
    console.error('POST /sustainability/compute error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
