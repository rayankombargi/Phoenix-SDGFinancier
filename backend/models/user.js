const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    location: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {
    timestamps: true
  });

  // Method to verify password
  User.prototype.verifyPassword = function(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  // Before creating a user, hash the password
  User.beforeCreate(async (user, options) => {
    const saltRounds = 10;
    user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
  });

  return User;
};
