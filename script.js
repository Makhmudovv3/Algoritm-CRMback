
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('AlgoritmCRM', 'postgres', 'abdulaziz123', { host: 'localhost', dialect: 'postgres', logging: false });
(async () => {
  const roles = await sequelize.query('SELECT name FROM ' + 'Roles' + '', { type: Sequelize.QueryTypes.SELECT });
  console.log('Roles:', roles.map(r => r.name).join(', '));
})();

