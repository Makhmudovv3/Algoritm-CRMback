'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FinanceAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FinanceAccount.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    balance: DataTypes.DECIMAL,
    branchId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'FinanceAccount',
  });
  return FinanceAccount;
};