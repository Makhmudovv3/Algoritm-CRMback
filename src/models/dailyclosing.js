'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyClosing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DailyClosing.init({
    date: DataTypes.DATE,
    totalAmount: DataTypes.DECIMAL,
    closedBy: DataTypes.UUID,
    branchId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'DailyClosing',
  });
  return DailyClosing;
};