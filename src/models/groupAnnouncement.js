'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupAnnouncement extends Model {
    static associate(models) {
      GroupAnnouncement.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
    }
  }
  GroupAnnouncement.init({
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
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'GroupAnnouncement',
    tableName: 'GroupAnnouncements',
    timestamps: true,
    paranoid: true,
  });
  return GroupAnnouncement;
};
