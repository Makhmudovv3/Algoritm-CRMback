'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add indexes for commonly queried fields to prevent performance drops (N+1 and large scans)
    await queryInterface.addIndex('Students', ['userId']);
    await queryInterface.addIndex('Students', ['branchId']);
    await queryInterface.addIndex('Payments', ['studentId']);
    await queryInterface.addIndex('Payments', ['invoiceId']);
    await queryInterface.addIndex('Payments', ['createdAt']);
    await queryInterface.addIndex('Invoices', ['studentId']);
    await queryInterface.addIndex('Groups', ['courseId']);
    await queryInterface.addIndex('Groups', ['teacherId']);
    await queryInterface.addIndex('Users', ['phone']);
    await queryInterface.addIndex('Users', ['roleId']);
    await queryInterface.addIndex('Attendances', ['studentId']);
    await queryInterface.addIndex('Attendances', ['groupId']);
    await queryInterface.addIndex('Attendances', ['date']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Attendances', ['date']);
    await queryInterface.removeIndex('Attendances', ['groupId']);
    await queryInterface.removeIndex('Attendances', ['studentId']);
    await queryInterface.removeIndex('Users', ['roleId']);
    await queryInterface.removeIndex('Users', ['phone']);
    await queryInterface.removeIndex('Groups', ['teacherId']);
    await queryInterface.removeIndex('Groups', ['courseId']);
    await queryInterface.removeIndex('Invoices', ['studentId']);
    await queryInterface.removeIndex('Payments', ['createdAt']);
    await queryInterface.removeIndex('Payments', ['invoiceId']);
    await queryInterface.removeIndex('Payments', ['studentId']);
    await queryInterface.removeIndex('Students', ['branchId']);
    await queryInterface.removeIndex('Students', ['userId']);
  }
};
