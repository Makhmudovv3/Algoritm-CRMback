'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CallNote extends Model {
    static associate(models) {
      if (models.Call) {
        CallNote.belongsTo(models.Call, { foreignKey: 'call_id', as: 'call' });
      }
      if (models.User) {
        CallNote.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      }
    }
  }

  CallNote.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    call_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CallNote',
    tableName: 'CallNotes',
    timestamps: true,
  });

  return CallNote;
};
