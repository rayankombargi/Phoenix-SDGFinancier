// src/models/SustainabilityQuestion.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SustainabilityQuestion = sequelize.define('SustainabilityQuestion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'References the category this question applies to',
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'The text of the survey question',
      get() {
        return this.getDataValue('question_text');
      }
    },
    possible_answers: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      comment: 'JSON mapping of answer options to multipliers',
    },
  }, {
    tableName: 'sustainability_questions',
    timestamps: true,
    underscored: true,
  });

  SustainabilityQuestion.associate = (models) => {
    SustainabilityQuestion.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  };

  return SustainabilityQuestion;
};
