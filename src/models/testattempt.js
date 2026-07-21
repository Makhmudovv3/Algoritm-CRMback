'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestAttempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TestAttempt.belongsTo(models.Test, { foreignKey: 'testId', as: 'test' });
      TestAttempt.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    }
  }
  TestAttempt.init({
    testId: DataTypes.UUID,
    studentId: DataTypes.UUID,
    score: DataTypes.INTEGER,
    answers: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'TestAttempt',
  });
  return TestAttempt;
};