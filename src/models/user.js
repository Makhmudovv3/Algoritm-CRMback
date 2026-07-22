'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
      User.belongsTo(models.Branch, { foreignKey: 'branchId', as: 'branch' });
    }

    async validatePassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^\+?[0-9]{10,15}$/
      }
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    branchId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lockUntil: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['phone']
      },
      {
        fields: ['createdAt']
      }
    ],
    hooks: {
      beforeDestroy: async (user, options) => {
        const timestamp = Date.now();
        const updates = {};
        if (user.email) {
          updates.email = `${user.email}_deleted_${timestamp}`;
        }
        if (user.phone) {
          updates.phone = `${user.phone}_deleted_${timestamp}`;
        }
        if (Object.keys(updates).length > 0) {
          await user.update(updates, { 
            transaction: options.transaction, 
            validate: false, 
            hooks: false 
          });
        }
      },
      beforeValidate: async (user) => {
        if (!user.password && user.phone) {
          user.password = user.phone.slice(-4);
        }
      },
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });
  return User;
};
