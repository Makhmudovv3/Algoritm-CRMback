'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const addIndexSafe = async (table, fields) => {
      try {
        await queryInterface.addIndex(table, fields);
      } catch (error) {
        console.log(`Index on ${table} for ${fields.join(', ')} might already exist. Ignoring.`);
      }
    };

    await addIndexSafe('Students', ['userId']);
    await addIndexSafe('Students', ['branchId']);
    await addIndexSafe('Payments', ['studentId']);
    await addIndexSafe('Payments', ['invoiceId']);
    await addIndexSafe('Payments', ['createdAt']);
    await addIndexSafe('Invoices', ['studentId']);
    await addIndexSafe('Groups', ['courseId']);
    await addIndexSafe('Groups', ['teacherId']);
    await addIndexSafe('Users', ['phone']);
    await addIndexSafe('Users', ['roleId']);
    await addIndexSafe('Attendances', ['studentId']);
    await addIndexSafe('Attendances', ['groupId']);
    await addIndexSafe('Attendances', ['date']);
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
