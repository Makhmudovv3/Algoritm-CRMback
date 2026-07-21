'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TestQuestion.belongsTo(models.Test, { foreignKey: 'testId', as: 'test' });
    }
  }
  TestQuestion.init({
    testId: DataTypes.UUID,
    questionText: DataTypes.TEXT,
    options: DataTypes.JSON,
    correctAnswer: DataTypes.STRING,
    points: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TestQuestion',
  });
  return TestQuestion;
};