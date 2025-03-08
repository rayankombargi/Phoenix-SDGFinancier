const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ExpenseAnswer = sequelize.define('ExpenseAnswer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    expense_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to the expense that this answer belongs to',
    },
    question_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to the sustainability question being answered',
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The answer provided by the user',
    },
  }, {
    tableName: 'expense_answers',
    timestamps: true,
  });

  return ExpenseAnswer;
};
