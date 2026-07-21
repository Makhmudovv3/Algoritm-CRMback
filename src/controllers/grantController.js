const BaseController = require('./baseController');
const grantService = require('../services/grantService');

class GrantController extends BaseController {
  constructor() {
    super(grantService, 'Grant');
  }
}

module.exports = new GrantController();
