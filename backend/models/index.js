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
const Expense = require('./expense')(sequelize);
const Category = require('./category')(sequelize);
const Budget = require('./budget')(sequelize);
const Reward = require('./reward')(sequelize);
const SustainabilityFactor = require('./sustainabilityFactor')(sequelize);
const SustainabilityMetric = require('./sustainabilityMetric')(sequelize);

// Define associations
Expense.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });
Category.hasOne(SustainabilityFactor, { as: 'sustainabilityFactor', foreignKey: 'category_id' });

// Optional: If you want Budget and Reward to use associations with Category, you can add:
// Budget.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });
// Reward.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });

module.exports = { 
  sequelize, 
  User, 
  Expense, 
  Category, 
  Budget, 
  Reward, 
  SustainabilityFactor, 
  SustainabilityMetric 
};
