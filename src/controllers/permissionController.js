const BaseController = require('./baseController');
const permissionService = require('../services/permissionService');

class PermissionController extends BaseController {
  constructor() {
    super(permissionService, 'Permission');
  }
}

module.exports = new PermissionController();
