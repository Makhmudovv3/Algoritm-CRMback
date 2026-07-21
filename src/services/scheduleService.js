const BaseService = require('./baseService');
const scheduleRepository = require('../repositories/scheduleRepository');

class ScheduleService extends BaseService {
  constructor() {
    super(scheduleRepository, []); // no default text search for these yet
  }
}

module.exports = new ScheduleService();
