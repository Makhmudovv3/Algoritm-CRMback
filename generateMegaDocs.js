const fs = require('fs');
const path = require('path');

const BACKEND_DIR = path.resolve(__dirname, 'src');
const FRONTEND_DIR = path.resolve(__dirname, '../frontend/src');
const OUTPUT_FILE = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\d2d66586-ba6f-4141-af5b-210c45c796d5\\comprehensive_technical_reference.md';

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

function parseJSFiles(dir, filterRegex) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(parseJSFiles(fullPath, filterRegex));
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (filterRegex) {
        let match;
        while ((match = filterRegex.exec(content)) !== null) {
          results.push({ file: fullPath.replace(dir, ''), name: match[1] || match[0], code: match[0] });
        }
      }
    }
  }
  return results;
}

async function generate() {
  const ws = fs.createWriteStream(OUTPUT_FILE);
  ws.write('# JustFiveCRM - Comprehensive Technical Reference\n\n');
  ws.write('> **NOTE**: This document was generated programmatically from the source code.\n\n');

  // 1. Folder Trees
  ws.write('## 1. Complete Folder Tree\n\n### Backend (`backend/src/`)\n```text\n');
  ws.write(getTree(BACKEND_DIR));
  ws.write('```\n\n### Frontend (`frontend/src/`)\n```text\n');
  ws.write(getTree(FRONTEND_DIR));
  ws.write('```\n\n');

  // 2. Database Models
  ws.write('## 2. Database Models & Schema\n\n');
  try {
    const { sequelize } = require('./src/models');
    const models = sequelize.models;
    for (const modelName of Object.keys(models)) {
      ws.write(`### Model: \`${modelName}\`\n\n`);
      const model = models[modelName];
      ws.write('**Columns**:\n');
      for (const attrName in model.rawAttributes) {
        const attr = model.rawAttributes[attrName];
        ws.write(`- \`${attrName}\`: type=${attr.type ? attr.type.key : 'UNKNOWN'}, allowNull=${attr.allowNull}, primaryKey=${attr.primaryKey || false}\n`);
      }
      ws.write('\n**Associations**:\n');
      const assocs = Object.values(model.associations);
      if (assocs.length === 0) ws.write('- None\n');
      for (const assoc of assocs) {
        ws.write(`- ${assoc.associationType} \`${assoc.target.name}\` (as \`${assoc.as}\`)\n`);
      }
      ws.write('\n');
    }
  } catch (e) {
    ws.write(`Error parsing models: ${e.message}\n\n`);
  }

  // 3. Backend Routes
  ws.write('## 3. Express Routes\n\n');
  const routeRegex = /router\.(get|post|put|delete|patch)\(['"`](.*?)['"`],\s*(.*?)\)/g;
  const routes = parseJSFiles(path.join(BACKEND_DIR, 'routes'), routeRegex);
  const routeGroups = {};
  routes.forEach(r => {
    if (!routeGroups[r.file]) routeGroups[r.file] = [];
    routeGroups[r.file].push(r);
  });
  for (const file in routeGroups) {
    ws.write(`### Route File: \`${file}\`\n`);
    routeGroups[file].forEach(r => {
      ws.write(`- \`${r.code.split(',')[0]})\` -> Handlers: \`${r.code.split(',').slice(1).join(',').trim().slice(0, -1)}\`\n`);
    });
    ws.write('\n');
  }

  // 4. Backend Controllers, Services, Repositories
  ws.write('## 4. Backend Architecture Methods\n\n');
  
  function dumpMethods(title, dir) {
    ws.write(`### ${title}\n`);
    const methodRegex = /(?:async\s+)?(?:function\s+([a-zA-Z0-9_]+)|([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>)/g;
    const files = parseJSFiles(dir); // Get all files, no filter yet
    for (const f of files) { // f is just undefined because parseJSFiles needs a regex if used that way. Let's write a simple method parser
      // rewrite method parser
    }
  }

  const methodRegex = /^(?:export\s+)?(?:const\s+|let\s+|var\s+)?([a-zA-Z0-9_]+)\s*(?:=|:)\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>|(?:async\s+)?function\s+([a-zA-Z0-9_]+)/gm;
  
  const parseAndWrite = (section, dir) => {
    ws.write(`### ${section}\n\n`);
    if(!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for(const file of files) {
      if(!file.endsWith('.js')) continue;
      ws.write(`#### \`${file}\`\n`);
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      let match;
      let found = false;
      while ((match = methodRegex.exec(content)) !== null) {
        const name = match[1] || match[2];
        if (name && !['require', 'module', 'exports'].includes(name)) {
          ws.write(`- \`${name}()\`\n`);
          found = true;
        }
      }
      if(!found) ws.write('- No exported functions matched.\n');
      ws.write('\n');
    }
  };

  parseAndWrite('Controllers', path.join(BACKEND_DIR, 'controllers'));
  parseAndWrite('Services', path.join(BACKEND_DIR, 'services'));
  parseAndWrite('Repositories', path.join(BACKEND_DIR, 'repositories'));
  parseAndWrite('Middlewares', path.join(BACKEND_DIR, 'middlewares'));

  // 5. Frontend Mappers & APIs
  ws.write('## 5. Frontend Mappers & APIs\n\n');
  parseAndWrite('Mappers', path.join(FRONTEND_DIR, 'mappers')); // check both mappers and services/mappers
  parseAndWrite('Services/Mappers', path.join(FRONTEND_DIR, 'services/mappers'));
  parseAndWrite('API Repositories', path.join(FRONTEND_DIR, 'services/api'));
  parseAndWrite('Contexts', path.join(FRONTEND_DIR, 'context'));
  parseAndWrite('Hooks', path.join(FRONTEND_DIR, 'hooks'));

  // 6. Flows & Manual Docs
  ws.write(`
## 6. Full Data Flow (React -> DB -> React)
1. **Component Trigger**: User clicks a button in \`React UI\`.
2. **Context / Local State**: State updates are staged.
3. **Frontend API Call**: Component calls a method from \`services/api/entity.js\`.
4. **Mapping (toBackend)**: Before Axios sends data, \`mapper.toBackend()\` converts camelCase UI state into strict snake_case or specific nested payload for DB compatibility.
5. **Axios Client**: \`apiClient\` intercepts, attaches \`Bearer Token\`, and fires HTTP Request.
6. **Backend Router**: Request hits \`routes/entityRoutes.js\`.
7. **Middlewares**: \`authMiddleware\` extracts JWT -> \`rbacMiddleware\` verifies Role Access.
8. **Controller**: Parses req.params/req.body, calls Service.
9. **Service**: Validates logic, applies pagination/filters, logs Audit trace, calls Repository.
10. **Repository**: Executes \`Sequelize\` model commands (SQL).
11. **Backend Response**: Controller calls \`successResponse(res, data)\`.
12. **Axios Interceptor**: Unwraps \`{ success: true, data: {...} }\`.
13. **Mapping (toFrontend)**: \`mapper.toFrontend()\` parses backend strict-types back to UI-friendly objects (e.g. string dates to JS Date objects).
14. **React UI**: Component re-renders with fresh data; Sonner Toast shows success notification.

## 7. Known Issues & Tech Debt
- **Type Safety**: The project lacks complete TypeScript definitions (currently using JS/JSX), leading to potential runtime mapping errors if DB schemas change.
- **Price Column Constraint**: In \`Course\` models, \`price\` is \`allowNull: false\`, requiring the frontend to ALWAYS send it even if UI omits it.
- **Soft Deletes vs Cascades**: Sequelize associations are defined, but hard deletions can cause orphaned records if \`paranoid: true\` isn't consistently utilized across all repos.

## 8. Troubleshooting
- **401 Unauthorized**: Token expired. Frontend \`axiosConfig\` will attempt \`/auth/refresh\`. If refresh token is expired, UI redirects to \`/login\`.
- **403 Forbidden**: \`rbacMiddleware\` triggered. The logged-in user's role is missing from the router's allowed array.
- **422 Unprocessable Entity**: Sequelize Validation failed (e.g., unique constraint, notNull violation). Check the mapper \`toBackend\`.
- **500 Internal Error**: Process crashed. Checked \`logs/error.log\`.
- **ENOTFOUND postgres**: Railway deployment issue or local \`DATABASE_URL\` is pointing to an inaccessible internal network. Ensure local uses \`localhost:5432\` and production uses external URL.

`);
  ws.end();
}

generate().then(() => console.log('Done')).catch(console.error);
