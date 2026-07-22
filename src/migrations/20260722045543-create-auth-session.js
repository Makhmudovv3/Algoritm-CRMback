'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AuthSessions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      refreshTokenHash: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      ipAddress: {
        type: Sequelize.STRING
      },
      browser: {
        type: Sequelize.STRING
      },
      device: {
        type: Sequelize.STRING
      },
      operatingSystem: {
        type: Sequelize.STRING
      },
      lastActivity: {
        type: Sequelize.DATE
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AuthSessions');
  }
};