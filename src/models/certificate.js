'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    static associate(models) {
      Certificate.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
      Certificate.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    }
  }
  Certificate.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    studentId: { type: DataTypes.UUID, allowNull: false },
    courseId: { type: DataTypes.UUID, allowNull: false },
    issueDate: { type: DataTypes.DATEONLY, allowNull: false },
    fileUrl: { type: DataTypes.STRING },
    publicId: { type: DataTypes.STRING },
    secureUrl: { type: DataTypes.STRING },
    resourceType: { type: DataTypes.STRING },
    fileSize: { type: DataTypes.INTEGER }
  }, { sequelize, modelName: 'Certificate', tableName: 'Certificates', timestamps: true, paranoid: true });
  return Certificate;
};
