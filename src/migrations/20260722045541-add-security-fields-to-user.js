'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'failedLoginAttempts', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Users', 'lockUntil', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'isBlocked', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn('Users', 'tokenVersion', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'failedLoginAttempts');
    await queryInterface.removeColumn('Users', 'lockUntil');
    await queryInterface.removeColumn('Users', 'isBlocked');
    await queryInterface.removeColumn('Users', 'tokenVersion');
  }
};
