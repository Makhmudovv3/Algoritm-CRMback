'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CallLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CallLog.init({
    userId: DataTypes.UUID,
    type: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    notes: DataTypes.TEXT,
    branchId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'CallLog',
  });
  return CallLog;
};