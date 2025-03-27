require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, Category } = require('./models');

// Route modules
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const expenseRoutes = require('./routes/expenseModel');
const rewardsRoutes = require('./routes/rewards');
const sustainabilityRoutes = require('./routes/sustainability');
const budgetRouter = require('./routes/budget');
const questionsRouter = require('./routes/questions');
const chatbotRoutes = require('./routes/chatbot');

const app = express();

// Enable CORS
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Seed categories (idempotent)
const categories = [
  'Debts & Loans', 'Savings & Investments', 'Shopping & Lifestyle',
  'Food & Dining', 'Health & Wellness', 'Travel & Leisure',
  'Education & Self-Development', 'Giving & Charity', 'Other'
];
categories.forEach(name => Category.findOrCreate({ where: { name }, defaults: { description: '' } }));

// Mount all API routes under their own paths
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/expenses', expenseRoutes);
app.use('/budget', budgetRouter);
app.use('/rewards', rewardsRoutes);
app.use('/sustainability', sustainabilityRoutes);
app.use('/questions', questionsRouter);
app.use('/chatbot', chatbotRoutes);

// Serve React static files
const buildDir = path.join(__dirname, '../build');
app.use(express.static(buildDir));
app.get('*', (req, res) => res.sendFile(path.join(buildDir, 'index.html')));

// Sync database (no server.listen in serverless)
sequelize.sync()
  .then(() => console.log('✅ Database synced'))
  .catch(err => console.error('❌ DB sync error:', err));

module.exports = app;