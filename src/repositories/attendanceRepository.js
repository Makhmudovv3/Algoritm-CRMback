const BaseRepository = require('./baseRepository');
const { Attendance } = require('../models');

class AttendanceRepository extends BaseRepository {
  constructor() {
    super(Attendance);
  }
}

module.exports = new AttendanceRepository();
