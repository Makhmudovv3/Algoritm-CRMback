'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      Discount.hasMany(models.Grant, { foreignKey: 'discountId', as: 'grants' });
    }
  }
  Discount.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    description: DataTypes.STRING,
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { sequelize, modelName: 'Discount', tableName: 'Discounts', timestamps: true, paranoid: true });
  return Discount;
};
