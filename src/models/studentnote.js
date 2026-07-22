'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentNote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentNote.init({
    studentId: DataTypes.UUID,
    authorId: DataTypes.UUID,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'StudentNote',
  });
  return StudentNote;
};