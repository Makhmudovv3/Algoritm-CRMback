'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if column exists to avoid errors if it was already added somehow
    const tableInfo = await queryInterface.describeTable('Users');
    if (!tableInfo.branchId) {
      await queryInterface.addColumn('Users', 'branchId', {
        type: Sequelize.UUID,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'branchId');
  }
};
