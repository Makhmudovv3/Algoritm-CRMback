'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    static associate(models) {
      Lead.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
      Lead.belongsTo(models.Branch, { foreignKey: 'branchId', as: 'branch' });
    }
  }
  Lead.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    source: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'CONVERTED'),
      defaultValue: 'NEW'
    },
    courseId: DataTypes.UUID,
    branchId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Lead',
    tableName: 'Leads',
    timestamps: true,
    paranoid: true,
  });
  return Lead;
};
