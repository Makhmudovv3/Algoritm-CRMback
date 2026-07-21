'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      Document.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Document.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    fileUrl: { type: DataTypes.STRING, allowNull: false },
    fileType: { type: DataTypes.STRING },
    publicId: { type: DataTypes.STRING },
    secureUrl: { type: DataTypes.STRING },
    resourceType: { type: DataTypes.STRING },
    fileSize: { type: DataTypes.INTEGER }
  }, { sequelize, modelName: 'Document', tableName: 'Documents', timestamps: true, paranoid: true });
  return Document;
};
