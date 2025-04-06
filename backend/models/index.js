const { Sequelize } = require('sequelize');
require('dotenv').config();

// Connect to database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

// Import models
// Note how we pass both (sequelize, Sequelize.DataTypes) to each model
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Expense = require('./expenseModel')(sequelize, Sequelize.DataTypes);
const Category = require('./category')(sequelize, Sequelize.DataTypes);
const Budget = require('./budget')(sequelize, Sequelize.DataTypes);
const SustainabilityFactor = require('./sustainabilityFactor')(sequelize, Sequelize.DataTypes);
const SustainabilityMetric = require('./sustainabilityMetric')(sequelize, Sequelize.DataTypes);
const SustainabilityQuestion = require('./sustainabilityQuestion')(sequelize, Sequelize.DataTypes);
const ExpenseAnswer = require('./expenseAnswer')(sequelize, Sequelize.DataTypes);
const Reward = require('./reward')(sequelize, Sequelize.DataTypes);

// Associations

// Expense to Category
Expense.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });
Category.hasMany(Expense, { as: 'expenses', foreignKey: 'category_id' });

// Category to SustainabilityFactor
Category.hasOne(SustainabilityFactor, { as: 'sustainabilityFactor', foreignKey: 'category_id' });
SustainabilityFactor.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Category to SustainabilityQuestion
Category.hasMany(SustainabilityQuestion, { as: 'questions', foreignKey: 'category_id' });
SustainabilityQuestion.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Expense to ExpenseAnswer
Expense.hasMany(ExpenseAnswer, { as: 'answers', foreignKey: 'expense_id' });
ExpenseAnswer.belongsTo(Expense, { foreignKey: 'expense_id', as: 'expense' });

// SustainabilityQuestion to ExpenseAnswer
SustainabilityQuestion.hasMany(ExpenseAnswer, { as: 'answers', foreignKey: 'question_id' });
ExpenseAnswer.belongsTo(SustainabilityQuestion, { foreignKey: 'question_id', as: 'question' });

// User <-> Reward
User.hasMany(Reward, { foreignKey: 'userId' });
Reward.belongsTo(User, { foreignKey: 'userId' });

// Export models and the sequelize connection
module.exports = {
  sequelize,
  User,
  Expense,
  Category,
  Budget,
  Reward,
  SustainabilityFactor,
  SustainabilityMetric,
  SustainabilityQuestion,
  ExpenseAnswer
};
