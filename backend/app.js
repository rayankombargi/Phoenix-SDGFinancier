require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const expenseRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budget');
const rewardsRoutes = require('./routes/rewards');
const sustainabilityRoutes = require('./routes/sustainability');

const app = express();

// Use JSON parsing middleware before defining routes.
app.use(express.json());

// Define routes.
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/expenses', expenseRoutes);
app.use('/budget', budgetRoutes);
app.use('/rewards', rewardsRoutes);
app.use('/sustainability', sustainabilityRoutes);

// Global error handler.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Only start the server if not in test mode.
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  sequelize.sync()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}

module.exports = app;
