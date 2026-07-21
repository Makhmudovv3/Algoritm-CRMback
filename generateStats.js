const fs = require('fs');
const path = require('path');

const BACKEND_DIR = path.resolve(__dirname, 'src');
const FRONTEND_DIR = path.resolve(__dirname, '../frontend/src');

function countFiles(dir, filterRegex) {
  let count = 0;
  if (!fs.existsSync(dir)) return count;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      count += countFiles(fullPath, filterRegex);
    } else {
      if (!filterRegex || filterRegex.test(file)) {
        count++;
      }
    }
  }
  return count;
}

function countJSFiles(dir) {
  return countFiles(dir, /\.(js|jsx)$/);
}

function getTree(dir, prefix = '') {
  if (!fs.existsSync(dir)) return '';
  let tree = '';
  const files = fs.readdirSync(dir).sort();
  files.forEach((file, index) => {
    if (file === 'node_modules' || file === '.git' || file === 'dist') return;
    const isLast = index === files.length - 1;
    const stat = fs.statSync(path.join(dir, file));
    tree += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;
    if (stat.isDirectory()) {
      tree += getTree(path.join(dir, file), prefix + (isLast ? '    ' : '│   '));
    }
  });
  return tree;
}

async function runStats() {
  const stats = {};
  stats.frontendFiles = countFiles(FRONTEND_DIR);
  stats.backendFiles = countFiles(BACKEND_DIR);
  stats.tree = 'Backend:\n' + getTree(BACKEND_DIR) + '\nFrontend:\n' + getTree(FRONTEND_DIR);
  
  // Models
  const { sequelize } = require('./src/models');
  stats.models = Object.keys(sequelize.models).length;
  
  // Routes
  const routeDocs = JSON.parse(fs.readFileSync('routeDocs.json', 'utf8'));
  stats.routes = routeDocs.length;
  
  // Folders
  stats.controllers = countJSFiles(path.join(BACKEND_DIR, 'controllers'));
  stats.services = countJSFiles(path.join(BACKEND_DIR, 'services'));
  stats.repositories = countJSFiles(path.join(BACKEND_DIR, 'repositories'));
  stats.middlewares = countJSFiles(path.join(BACKEND_DIR, 'middlewares'));
  
  // Frontend
  stats.components = countFiles(path.join(FRONTEND_DIR, 'components'), /\.(js|jsx)$/);
  stats.contexts = countJSFiles(path.join(FRONTEND_DIR, 'context'));
  stats.hooks = countJSFiles(path.join(FRONTEND_DIR, 'hooks'));
  stats.apiRepos = countJSFiles(path.join(FRONTEND_DIR, 'services/api'));
  stats.mappers = countJSFiles(path.join(FRONTEND_DIR, 'services/mappers')) + countJSFiles(path.join(FRONTEND_DIR, 'mappers'));
  
  // Functions
  const methodRegex = /^(?:export\s+)?(?:const\s+|let\s+|var\s+)?([a-zA-Z0-9_]+)\s*(?:=|:)\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>|(?:async\s+)?function\s+([a-zA-Z0-9_]+)/gm;
  function countFunctions(dir) {
    let funcs = 0;
    if (!fs.existsSync(dir)) return funcs;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
         funcs += countFunctions(fullPath);
      } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
         const content = fs.readFileSync(fullPath, 'utf8');
         let match;
         while ((match = methodRegex.exec(content)) !== null) {
           funcs++;
         }
      }
    }
    return funcs;
  }
  
  stats.totalFunctions = countFunctions(BACKEND_DIR) + countFunctions(FRONTEND_DIR);
  
  // Envs
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const envVars = envContent.split('\n').filter(l => l.includes('=') && !l.startsWith('#')).length;
  
  let frontendEnvVars = 0;
  if(fs.existsSync(path.join(__dirname, '../frontend/.env'))) {
     frontendEnvVars = fs.readFileSync(path.join(__dirname, '../frontend/.env'), 'utf8').split('\n').filter(l => l.includes('=') && !l.startsWith('#')).length;
  }
  stats.envVars = envVars + frontendEnvVars;
  
  // Sockets (count emit/on)
  function countSockets(dir) {
     let sockets = 0;
     if (!fs.existsSync(dir)) return sockets;
     const files = fs.readdirSync(dir);
     for (const file of files) {
       const fullPath = path.join(dir, file);
       if (fs.statSync(fullPath).isDirectory()) {
          sockets += countSockets(fullPath);
       } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          sockets += (content.match(/socket\.(on|emit)\(/g) || []).length;
          sockets += (content.match(/io\.(on|emit)\(/g) || []).length;
       }
     }
     return sockets;
  }
  stats.sockets = countSockets(BACKEND_DIR) + countSockets(FRONTEND_DIR);
  
  console.log(JSON.stringify(stats, null, 2));
  process.exit();
}

runStats().catch(console.error);
