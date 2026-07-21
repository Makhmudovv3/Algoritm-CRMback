require('dotenv').config();
const { User } = require('./src/models');

async function showPhones() {
  try {
    const users = await User.findAll();
    console.log(users.map(u => ({ id: u.id, phone: u.phone, email: u.email, firstName: u.firstName, lastName: u.lastName })));
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

showPhones();
