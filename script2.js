
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('AlgoritmCRM', 'postgres', 'abdulaziz123', { host: 'localhost', dialect: 'postgres', logging: false });
(async () => {
  try {
    const users = await sequelize.query('SELECT u.id, u.phone, u.role, r.name as rolename FROM ' + 'Users' + ' u LEFT JOIN ' + 'Roles' + ' r ON u.' + 'roleId' + ' = r.id', { type: Sequelize.QueryTypes.SELECT });
    console.log(users);
  } catch (e) {
    console.log(e.message);
  }
  process.exit();
})();

