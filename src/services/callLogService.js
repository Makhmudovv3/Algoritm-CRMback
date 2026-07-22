const BaseService = require('./baseService');
const { CallLog } = require('../models');

class CallLogService extends BaseService {
  constructor() {
    super(CallLog);
  }
}

module.exports = new CallLogService();
