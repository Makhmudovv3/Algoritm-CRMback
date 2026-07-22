const BaseController = require('./baseController');
const auditLogService = require('../services/auditLogService');

class AuditLogController extends BaseController {
  constructor() {
    super(auditLogService, 'AuditLog');
  }
}

module.exports = new AuditLogController();
