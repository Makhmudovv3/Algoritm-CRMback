'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PaymentRequest.init({
    studentId: DataTypes.UUID,
    amount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    branchId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'PaymentRequest',
  });
  return PaymentRequest;
};