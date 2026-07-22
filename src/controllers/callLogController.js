const BaseController = require('./baseController');
const callLogService = require('../services/callLogService');

class CallLogController extends BaseController {
  constructor() {
    super(callLogService, 'CallLog');
  }
}

module.exports = new CallLogController();
