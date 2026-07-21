'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Notification.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'system' }, // payment, system, academic, etc.
    priority: { type: DataTypes.STRING, allowNull: false, defaultValue: 'low' }, // low, medium, high, critical
    category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'general' },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { sequelize, modelName: 'Notification', tableName: 'Notifications', timestamps: true, paranoid: true, indexes: [{ fields: ['userId'] }] });
  return Notification;
};
