const BaseController = require('./baseController');
const financeAccountService = require('../services/financeAccountService');

class FinanceAccountController extends BaseController {
  constructor() {
    super(financeAccountService, 'FinanceAccount');
  }
}

module.exports = new FinanceAccountController();
