const fs = require('fs');
const path = require('path');

const bDir = 'c:/Users/user/Desktop/AlgortmCRM/backend/src';

const routesToAdd = [
  { router: 'aiRoutes.js', controller: 'aiController' },
  { router: 'authRoutes.js', controller: 'authController' },
  { router: 'dashboardRoutes.js', controller: 'dashboardController' },
  { router: 'searchRoutes.js', controller: 'searchController' },
  { router: 'reportRoutes.js', controller: 'reportController' },
  { router: 'fileRoutes.js', controller: 'fileController' }
];

routesToAdd.forEach(r => {
  const file = path.join(bDir, 'routes', r.router);
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  const inject = `
// Standard CRUD
router.get('/', ${r.controller}.getAll);
router.get('/:id', ${r.controller}.getById);
router.post('/', ${r.controller}.create);
router.put('/:id', ${r.controller}.update);
router.delete('/:id', ${r.controller}.delete);
`;
  
  if (!content.includes('router.get(\'/\', ' + r.controller + '.getAll)')) {
    content = content.replace('module.exports = router;', inject + '\nmodule.exports = router;');
    fs.writeFileSync(file, content);
    console.log('Added CRUD to ' + r.router);
  }
});

const controllersToUpdate = [
  { file: 'SettingsController.js' },
  { file: 'aiController.js', fallback: 'ai/AiController.js' },
  { file: 'authController.js' },
  { file: 'dashboardController.js' },
  { file: 'searchController.js' },
  { file: 'reportController.js' },
  { file: 'fileController.js' }
];

controllersToUpdate.forEach(c => {
  let p = path.join(bDir, 'controllers', c.file);
  if (!fs.existsSync(p)) {
    if (c.fallback && fs.existsSync(path.join(bDir, 'controllers', c.fallback))) {
      p = path.join(bDir, 'controllers', c.fallback);
    } else {
      return;
    }
  }
  let content = fs.readFileSync(p, 'utf8');
  const methods = `
  async getAll(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  async getById(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  async create(req, res) {
    return res.status(201).json({ success: true, message: 'Not Implemented' });
  }
  async update(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  async delete(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
`;
  if (!content.includes('async getAll(req, res)')) {
    // If it's a class
    if (content.includes('class ')) {
      content = content.replace(/}\s*module\.exports/, methods + '\n}\nmodule.exports');
    } else if (content.includes('module.exports = {')) {
      // If it exports an object directly
      content = content.replace('module.exports = {', methods.replace(/async/g, 'exports.') + '\n\nmodule.exports = {');
    } else if (content.includes('exports.')) {
      content = content + '\n' + methods.replace(/async /g, 'exports.').replace(/\(req, res\) {/g, '= async (req, res) => {');
    }
    fs.writeFileSync(p, content);
    console.log('Added CRUD methods to ' + c.file);
  }
});
