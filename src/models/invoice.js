'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      Invoice.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
      Invoice.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
      Invoice.hasMany(models.Payment, { foreignKey: 'invoiceId', as: 'payments' });
    }
  }
  Invoice.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    studentId: { type: DataTypes.UUID, allowNull: false },
    groupId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    dueDate: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM('PENDING', 'PAID', 'OVERDUE', 'CANCELLED'), defaultValue: 'PENDING' }
  }, { sequelize, modelName: 'Invoice', tableName: 'Invoices', timestamps: true, paranoid: true });
  return Invoice;
};
