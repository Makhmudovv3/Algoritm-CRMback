const BaseService = require('./baseService');
const { DailyClosing } = require('../models');

class DailyClosingService extends BaseService {
  constructor() {
    super(DailyClosing);
  }
}

module.exports = new DailyClosingService();
