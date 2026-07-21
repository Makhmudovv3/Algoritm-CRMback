'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
      Payment.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    }
  }
  Payment.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    invoiceId: { type: DataTypes.UUID, allowNull: false },
    studentId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    paymentMethod: { type: DataTypes.ENUM('CASH', 'CARD', 'BANK_TRANSFER'), allowNull: false },
    transactionId: DataTypes.STRING,
    status: { type: DataTypes.ENUM('SUCCESS', 'PENDING', 'FAILED'), defaultValue: 'SUCCESS' }
  }, { sequelize, modelName: 'Payment', tableName: 'Payments', timestamps: true, paranoid: true });
  return Payment;
};
