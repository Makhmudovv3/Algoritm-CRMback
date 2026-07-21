require('dotenv').config();
const { User } = require('./src/models');
const bcrypt = require('bcrypt');

async function testPassword() {
  try {
    const user = await User.findOne({ where: { phone: '998995557778' } });
    if (user) {
      console.log('User found.');
      console.log('Password hash:', user.password);
      const isMatch = await bcrypt.compare('7778', user.password);
      console.log('Does 7778 match?', isMatch);
      const isMatch2 = await bcrypt.compare('995557778', user.password);
      console.log('Does 995557778 match?', isMatch2);
    } else {
      console.log('User not found.');
    }
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

testPassword();
