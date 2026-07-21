require('dotenv').config({ path: __dirname + '/../../.env' });
const { Role } = require('../models');

const ROLE_MAPPINGS = {
  'Manager': 'BRANCH_MANAGER',
  'CALL MARKAZ': 'CALL_CENTER',
  'Admin': 'SUPER_ADMIN',
  'Director': 'DIRECTOR',
  'Teacher': 'TEACHER',
  'Student': 'STUDENT',
  'Parent': 'PARENT',
  'Cashier': 'CASHIER',
  'Accountant': 'ACCOUNTANT'
};

async function migrateRoles() {
  try {
    const roles = await Role.findAll();
    console.log(`Found ${roles.length} roles in the database.`);
    
    for (let role of roles) {
      let upperName = role.name.toUpperCase();
      // Handle special mappings
      if (ROLE_MAPPINGS[role.name]) {
        upperName = ROLE_MAPPINGS[role.name];
      }
      
      if (role.name !== upperName) {
        console.log(`Migrating role: ${role.name} -> ${upperName}`);
        
        // Check if target role already exists
        const existing = await Role.findOne({ where: { name: upperName } });
        if (existing) {
          console.log(`Target role ${upperName} already exists! Skipping update for this row to avoid unique constraint errors.`);
        } else {
          role.name = upperName;
          await role.save();
          console.log(`Successfully updated to ${upperName}`);
        }
      } else {
        console.log(`Role ${role.name} is already standardized.`);
      }
    }
    console.log('Role migration completed.');
  } catch (error) {
    console.error('Error during role migration:', error);
  } finally {
    process.exit(0);
  }
}

migrateRoles();
