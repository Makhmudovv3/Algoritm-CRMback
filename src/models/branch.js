'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    static associate(models) {
      Branch.hasMany(models.Room, { foreignKey: 'branchId', as: 'rooms' });
      Branch.hasMany(models.Teacher, { foreignKey: 'branchId', as: 'teachers' });
      Branch.hasMany(models.Student, { foreignKey: 'branchId', as: 'students' });
      Branch.hasMany(models.Lead, { foreignKey: 'branchId', as: 'leads' });
      Branch.hasMany(models.Group, { foreignKey: 'branchId', as: 'groups' });
    }
  }
  Branch.init({
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
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Branch',
    tableName: 'Branches',
    timestamps: true,
    paranoid: true, // Soft delete enabled
  });
  return Branch;
};
