const { Teacher, Branch, User } = require('./src/models');

async function test() {
  try {
    const branches = await Branch.findAll();
    console.log('Branches:', branches.map(b => b.id));
    
    const teacherTable = await Teacher.describe();
    console.log('Teacher branchId allowNull:', teacherTable.branchId.allowNull);
    
  } catch (err) {
    console.error(err);
  }
}
test();
