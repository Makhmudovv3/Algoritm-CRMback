'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Material.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
    }
  }
  Material.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    url: DataTypes.STRING,
    groupId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Material',
  });
  return Material;
};