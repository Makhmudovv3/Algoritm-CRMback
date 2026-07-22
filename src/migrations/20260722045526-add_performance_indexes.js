'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const addIndexSafe = async (table, fields, indexName) => {
      const fieldsStr = fields.map(f => `"${f}"`).join(', ');
      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS "${indexName}" ON "${table}" (${fieldsStr});`
      );
    };

    await addIndexSafe('Students', ['userId'], 'students_user_id');
    await addIndexSafe('Students', ['branchId'], 'students_branch_id');
    await addIndexSafe('Payments', ['studentId'], 'payments_student_id');
    await addIndexSafe('Payments', ['invoiceId'], 'payments_invoice_id');
    await addIndexSafe('Payments', ['createdAt'], 'payments_created_at');
    await addIndexSafe('Invoices', ['studentId'], 'invoices_student_id');
    await addIndexSafe('Groups', ['courseId'], 'groups_course_id');
    await addIndexSafe('Groups', ['teacherId'], 'groups_teacher_id');
    await addIndexSafe('Users', ['phone'], 'users_phone');
    await addIndexSafe('Users', ['roleId'], 'users_role_id');
    await addIndexSafe('Attendances', ['studentId'], 'attendances_student_id');
    await addIndexSafe('Attendances', ['groupId'], 'attendances_group_id');
    await addIndexSafe('Attendances', ['date'], 'attendances_date');
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
