'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
      Schedule.belongsTo(models.Room, { foreignKey: 'roomId', as: 'room' });
    }
  }
  Schedule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    dayOfWeek: {
      type: DataTypes.ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'),
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    roomId: {
      type: DataTypes.UUID
    }
  }, {
    sequelize,
    modelName: 'Schedule',
    tableName: 'Schedules',
    timestamps: true,
    paranoid: true,
  });
  return Schedule;
};
