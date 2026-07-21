const BaseController = require('./baseController');
const roleService = require('../services/roleService');

class RoleController extends BaseController {
  constructor() {
    super(roleService, 'Role');
  }
}

module.exports = new RoleController();
