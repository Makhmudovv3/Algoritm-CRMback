const BaseRepository = require('./baseRepository');
const { Schedule } = require('../models');

class ScheduleRepository extends BaseRepository {
  constructor() {
    super(Schedule);
  }
}

module.exports = new ScheduleRepository();
