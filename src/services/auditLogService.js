const BaseService = require('./baseService');
const { AuditLog } = require('../models');

class AuditLogService extends BaseService {
  constructor() {
    super(AuditLog);
  }
}

module.exports = new AuditLogService();
