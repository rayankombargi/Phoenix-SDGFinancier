require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, Category } = require('./models');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const expenseRoutes = require('./routes/expenseModel');
const rewardsRoutes = require('./routes/rewards');
const sustainabilityRoutes = require('./routes/sustainability');
const budgetRouter = require('./routes/budget');
const questionsRouter = require('./routes/questions');
const chatbotRoutes = require('./routes/chatbot');

const app = express();

// Enable CORS for the specified frontend URL (or default to localhost:3000)
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Seed static categories
const categories = [
  'Debts & Loans', 'Savings & Investments', 'Shopping & Lifestyle',
  'Food & Dining', 'Health & Wellness', 'Travel & Leisure',
  'Education & Self-Development', 'Giving & Charity', 'Other'
];

categories.forEach(name => {
  Category.findOrCreate({ where: { name }, defaults: { description: '' } });
});

// Mount API routes
// Chatbot route is mounted at /api/chatbot to match frontend requests
app.use('/api/chatbot', chatbotRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/expenses', expenseRoutes);
app.use('/budget', budgetRouter);
app.use('/rewards', rewardsRoutes);
app.use('/sustainability', sustainabilityRoutes);
app.use('/questions', questionsRouter);

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all route to serve React's index.html for any client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Start the server (use port 5000 in development to avoid conflicts with the React dev server)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || (process.env.NODE_ENV === 'development' ? 5000 : 3000);
  sequelize.sync()
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('DB connection error:', err));
}

module.exports = app;
