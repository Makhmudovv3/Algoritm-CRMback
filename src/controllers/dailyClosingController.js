const BaseController = require('./baseController');
const dailyClosingService = require('../services/dailyClosingService');

class DailyClosingController extends BaseController {
  constructor() {
    super(dailyClosingService, 'DailyClosing');
  }
}

module.exports = new DailyClosingController();
