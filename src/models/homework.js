'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Homework extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Homework.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
      Homework.hasMany(models.HomeworkSubmission, { foreignKey: 'homeworkId', as: 'submissions' });
    }
  }
  Homework.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    deadline: DataTypes.DATE,
    groupId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Homework',
  });
  return Homework;
};