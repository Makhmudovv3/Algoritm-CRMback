'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Parent extends Model {
    static associate(models) {
      Parent.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Parent.hasMany(models.Student, { foreignKey: 'parentId', as: 'students' });
    }
  }
  Parent.init({
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
    additionalPhone: DataTypes.STRING,
    occupation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Parent',
    tableName: 'Parents',
    timestamps: true,
    paranoid: true,
  });
  return Parent;
};
