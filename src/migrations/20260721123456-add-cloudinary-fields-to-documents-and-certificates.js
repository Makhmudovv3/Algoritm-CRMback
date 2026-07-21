'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tablePromises = [];

    // Documents
    const documentColumns = ['publicId', 'secureUrl', 'resourceType'];
    for (const column of documentColumns) {
      tablePromises.push(queryInterface.addColumn('Documents', column, {
        type: Sequelize.STRING,
        allowNull: true
      }).catch(err => {
        // Ignore if exists
        console.warn(`Column ${column} might already exist in Documents:`, err.message);
      }));
    }
    tablePromises.push(queryInterface.addColumn('Documents', 'fileSize', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).catch(err => console.warn(err.message)));

    // Certificates
    for (const column of documentColumns) {
      tablePromises.push(queryInterface.addColumn('Certificates', column, {
        type: Sequelize.STRING,
        allowNull: true
      }).catch(err => {
        console.warn(`Column ${column} might already exist in Certificates:`, err.message);
      }));
    }
    tablePromises.push(queryInterface.addColumn('Certificates', 'fileSize', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).catch(err => console.warn(err.message)));

    await Promise.all(tablePromises);
  },

  async down(queryInterface, Sequelize) {
    const documentColumns = ['publicId', 'secureUrl', 'resourceType', 'fileSize'];
    const tablePromises = [];

    for (const column of documentColumns) {
      tablePromises.push(queryInterface.removeColumn('Documents', column).catch(() => {}));
      tablePromises.push(queryInterface.removeColumn('Certificates', column).catch(() => {}));
    }

    await Promise.all(tablePromises);
  }
};
