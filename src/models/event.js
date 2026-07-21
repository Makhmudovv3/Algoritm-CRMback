'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
    }
  }
  Event.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    type: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    allDay: { type: DataTypes.BOOLEAN, defaultValue: false },
    color: DataTypes.STRING,
    location: DataTypes.STRING,
    ownerId: DataTypes.UUID,
    ownerType: DataTypes.STRING,
    branchId: DataTypes.UUID,
    createdBy: { type: DataTypes.UUID, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'ACTIVE' }
  }, { sequelize, modelName: 'Event', tableName: 'Events', timestamps: true, paranoid: true });
  return Event;
};
