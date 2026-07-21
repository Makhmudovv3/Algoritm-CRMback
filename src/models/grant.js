'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Grant extends Model {
    static associate(models) {
      Grant.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
      Grant.belongsTo(models.Discount, { foreignKey: 'discountId', as: 'discount' });
    }
  }
  Grant.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    studentId: { type: DataTypes.UUID, allowNull: false },
    discountId: { type: DataTypes.UUID, allowNull: false },
    reason: DataTypes.STRING,
    status: { type: DataTypes.ENUM('ACTIVE', 'REVOKED'), defaultValue: 'ACTIVE' }
  }, { sequelize, modelName: 'Grant', tableName: 'Grants', timestamps: true, paranoid: true });
  return Grant;
};
