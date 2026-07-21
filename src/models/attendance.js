'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Lesson, { foreignKey: 'lessonId', as: 'lesson' });
      Attendance.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    }
  }
  Attendance.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED'),
      allowNull: false
    },
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'Attendances',
    timestamps: true,
    paranoid: true,
  });
  return Attendance;
};
