const fs = require('fs');
const path = require('path');
const dir = './src/modules/callcenter/routes';
const files = fs.readdirSync(dir);
files.forEach(f => {
  if (f.endsWith('.js') && f !== 'index.js') {
    const fullPath = path.join(dir, f);
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(
      /const ROLES = \{[^\}]+\};/,
      "const ROLES = { SUPER_ADMIN: 'SUPER_ADMIN', DIRECTOR: 'DIRECTOR', BRANCH_MANAGER: 'BRANCH_MANAGER', CALL_CENTER: 'CALL MARKAZ', ADMIN: 'ADMIN', MANAGER: 'MANAGER' };"
    );
    content = content.replace(
      /verifyRole\(\[.*?\]\)/,
      "verifyRole([ROLES.SUPER_ADMIN, ROLES.DIRECTOR, ROLES.BRANCH_MANAGER, ROLES.CALL_CENTER, ROLES.ADMIN, ROLES.MANAGER])"
    );
    fs.writeFileSync(fullPath, content);
    console.log('Updated', f);
  }
});
