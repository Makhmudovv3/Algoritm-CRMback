'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuthSession extends Model {
    static associate(models) {
      AuthSession.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  AuthSession.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    refreshTokenHash: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ipAddress: DataTypes.STRING,
    browser: DataTypes.STRING,
    device: DataTypes.STRING,
    operatingSystem: DataTypes.STRING,
    lastActivity: DataTypes.DATE,
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'AuthSession',
    tableName: 'AuthSessions',
    timestamps: true
  });
  return AuthSession;
};