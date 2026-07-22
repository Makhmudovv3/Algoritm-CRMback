'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentGroup.init({
    studentId: DataTypes.UUID,
    groupId: DataTypes.UUID,
    joinedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'StudentGroup',
  });
  return StudentGroup;
};