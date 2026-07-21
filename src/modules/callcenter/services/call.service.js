const BaseService = require('../../../services/baseService');
const callRepository = require('../repositories/call.repository');

class CallService extends BaseService {
  constructor() {
    super(callRepository, ['caller_name', 'phone', 'call_sid']);
  }
}

module.exports = new CallService();
