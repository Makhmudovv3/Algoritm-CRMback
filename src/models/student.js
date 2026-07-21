'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      Student.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Student.belongsTo(models.Parent, { foreignKey: 'parentId', as: 'parent' });
      Student.belongsTo(models.Branch, { foreignKey: 'branchId', as: 'branch' });
    }
  }
  Student.init({
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
    parentId: {
      type: DataTypes.UUID
    },
    branchId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    dateOfBirth: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Student',
    tableName: 'Students',
    timestamps: true,
    paranoid: true,
  });
  return Student;
};
