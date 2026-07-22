'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = ['Students', 'Teachers', 'Groups', 'Payments', 'Leads'];
    for (const table of tables) {
      await queryInterface.addColumn(table, 'branchId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Branches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }).catch(() => console.log(`Column branchId might already exist in ${table}`));
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tables = ['Students', 'Teachers', 'Groups', 'Payments', 'Leads'];
    for (const table of tables) {
      await queryInterface.removeColumn(table, 'branchId').catch(() => {});
    }
  }
};
