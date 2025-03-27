const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    location: DataTypes.STRING,
    bio: DataTypes.TEXT,
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
  });

  User.prototype.verifyPassword = function(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.beforeCreate(async user => {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
  });

  return User;
};
