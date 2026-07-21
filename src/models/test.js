'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Test.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
      Test.hasMany(models.TestQuestion, { foreignKey: 'testId', as: 'questions' });
      Test.hasMany(models.TestAttempt, { foreignKey: 'testId', as: 'attempts' });
    }
  }
  Test.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    groupId: DataTypes.UUID,
    duration: DataTypes.INTEGER,
    deadline: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Test',
  });
  return Test;
};