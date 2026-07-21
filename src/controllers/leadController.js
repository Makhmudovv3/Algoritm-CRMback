const BaseController = require('./baseController');
const leadService = require('../services/leadService');

class LeadController extends BaseController {
  constructor() {
    super(leadService, 'Lead');
  }
}

module.exports = new LeadController();
