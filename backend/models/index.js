const { Sequelize } = require('sequelize');
require('dotenv').config();

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
const User = require('./user')(sequelize);
const Expense = require('./expenseModel')(sequelize);
const Category = require('./category')(sequelize);
const Budget = require('./budget')(sequelize);
const Reward = require('./reward')(sequelize);
const SustainabilityFactor = require('./sustainabilityFactor')(sequelize);
const SustainabilityMetric = require('./sustainabilityMetric')(sequelize);
const SustainabilityQuestion = require('./sustainabilityQuestion')(sequelize);
const ExpenseAnswer = require('./expenseAnswer')(sequelize);

// Associations

// Expense to Category
Expense.belongsTo(Category, { as: 'category', foreignKey: 'category_id', constraints: false });
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
