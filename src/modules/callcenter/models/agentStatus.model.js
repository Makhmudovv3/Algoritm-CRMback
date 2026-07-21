'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AgentStatus extends Model {
    static associate(models) {
      if (models.User) {
        AgentStatus.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      }
    }
  }

  AgentStatus.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true // Usually one status per agent
    },
    status: {
      type: DataTypes.ENUM('available', 'busy', 'break', 'offline'),
      defaultValue: 'offline'
    },
    last_activity: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'AgentStatus',
    tableName: 'AgentStatuses',
    timestamps: true, // we might not strictly need it, but good practice
  });

  return AgentStatus;
};
