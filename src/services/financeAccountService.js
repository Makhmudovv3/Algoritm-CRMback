const BaseService = require('./baseService');
const { FinanceAccount } = require('../models');

class FinanceAccountService extends BaseService {
  constructor() {
    super(FinanceAccount);
  }
}

module.exports = new FinanceAccountService();
