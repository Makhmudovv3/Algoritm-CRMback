require('dotenv').config();
const { User } = require('./src/models');

async function fixPhones() {
  try {
    const users = await User.findAll();
    let count = 0;
    for (const user of users) {
      if (user.phone && user.phone.startsWith('+')) {
        const cleanPhone = user.phone.replace(/\D/g, '');
        await user.update({ phone: cleanPhone });
        count++;
      }
    }
    console.log(`Fixed ${count} user phone numbers.`);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

fixPhones();
