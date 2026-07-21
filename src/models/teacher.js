'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      Teacher.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Teacher.belongsTo(models.Branch, { foreignKey: 'branchId', as: 'branch' });
      Teacher.hasMany(models.Group, { foreignKey: 'teacherId', as: 'groups' });
    }
  }
  Teacher.init({
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
    branchId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    salaryPerStudent: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    specialties: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'Teachers',
    timestamps: true,
    paranoid: true,
  });
  return Teacher;
};
