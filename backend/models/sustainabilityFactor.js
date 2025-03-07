const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SustainabilityFactor = sequelize.define('SustainabilityFactor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    co2_factor: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    water_usage_factor: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    renewable_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  }, {
    timestamps: true,
  });

  return SustainabilityFactor;
};
