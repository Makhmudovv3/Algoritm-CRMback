'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roleId = uuidv4();
    await queryInterface.bulkInsert('Roles', [{
      id: roleId,
      name: 'SUPER_ADMIN',
      description: 'Super Administrator',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('6434', salt);

    await queryInterface.bulkInsert('Users', [{
      id: uuidv4(),
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@algoritm.uz',
      phone: '998909086434',
      password: hashedPassword,
      roleId: roleId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@algoritm.uz' }, {});
    await queryInterface.bulkDelete('Roles', { name: 'SUPER_ADMIN' }, {});
  }
};
