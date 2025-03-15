const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SustainabilityQuestion = sequelize.define('SustainabilityQuestion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Link the question to a category.
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'References the category this question applies to',
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'The text of the survey question',
    },
    // A JSON object mapping answer options to multipliers.
    // For example: { "Yes": 0.8, "No": 1.0 }
    possible_answers: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'JSON mapping of answer options to multipliers',
    },
  }, {
    tableName: 'sustainability_questions',
    timestamps: true,
  });

  return SustainabilityQuestion;
};
