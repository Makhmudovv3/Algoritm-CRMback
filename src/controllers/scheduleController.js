const BaseController = require('./baseController');
const scheduleService = require('../services/scheduleService');

class ScheduleController extends BaseController {
  constructor() {
    super(scheduleService, 'Schedule');
  }
}

module.exports = new ScheduleController();
