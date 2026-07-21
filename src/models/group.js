'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
      Group.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teacher' });
      Group.belongsTo(models.Room, { foreignKey: 'roomId', as: 'room' });
      Group.belongsTo(models.Branch, { foreignKey: 'branchId', as: 'branch' });
    }
  }
  Group.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    branchId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    schedule: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'PENDING'
    },
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Group',
    tableName: 'Groups',
    timestamps: true,
    paranoid: true,
  });
  return Group;
};
