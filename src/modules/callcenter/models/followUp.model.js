'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FollowUp extends Model {
    static associate(models) {
      if (models.Call) {
        FollowUp.belongsTo(models.Call, { foreignKey: 'call_id', as: 'call' });
      }
      if (models.Student) {
        FollowUp.belongsTo(models.Student, { foreignKey: 'customer_id', as: 'customer' });
      }
      if (models.User) {
        FollowUp.belongsTo(models.User, { foreignKey: 'assigned_to', as: 'assignee' });
      }
    }
  }

  FollowUp.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    call_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: false
    },
    follow_up_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'FollowUp',
    tableName: 'FollowUps',
    timestamps: true,
  });

  return FollowUp;
};
