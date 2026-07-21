const BaseController = require('../../../controllers/baseController');
const callService = require('../services/call.service');

class CallController extends BaseController {
  constructor() {
    super(callService, 'Call');
  }
}

module.exports = new CallController();
