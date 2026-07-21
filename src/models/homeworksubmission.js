'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HomeworkSubmission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      HomeworkSubmission.belongsTo(models.Homework, { foreignKey: 'homeworkId', as: 'homework' });
      HomeworkSubmission.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    }
  }
  HomeworkSubmission.init({
    homeworkId: DataTypes.UUID,
    studentId: DataTypes.UUID,
    content: DataTypes.TEXT,
    fileUrl: DataTypes.STRING,
    score: DataTypes.INTEGER,
    feedback: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'HomeworkSubmission',
  });
  return HomeworkSubmission;
};