const BaseService = require('./baseService');
const { Permission } = require('../models');

class PermissionService extends BaseService {
  constructor() {
    super(Permission);
  }
}

module.exports = new PermissionService();
