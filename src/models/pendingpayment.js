'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PendingPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PendingPayment.init({
    studentId: DataTypes.UUID,
    amount: DataTypes.DECIMAL,
    dueDate: DataTypes.DATE,
    status: DataTypes.STRING,
    branchId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'PendingPayment',
  });
  return PendingPayment;
};