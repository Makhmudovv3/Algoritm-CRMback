const BaseController = require('../../../controllers/baseController');
const followUpService = require('../services/followUp.service');

class FollowUpController extends BaseController {
  constructor() {
    super(followUpService, 'FollowUp');
  }
}

module.exports = new FollowUpController();
