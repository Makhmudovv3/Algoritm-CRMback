'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
      Lesson.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teacher' });
      Lesson.hasMany(models.Attendance, { foreignKey: 'lessonId', as: 'attendances' });
    }
  }
  Lesson.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    topic: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'SCHEDULED'
    }
  }, {
    sequelize,
    modelName: 'Lesson',
    tableName: 'Lessons',
    timestamps: true,
    paranoid: true,
  });
  return Lesson;
};
