const BaseRepository = require('./baseRepository');
const { Teacher } = require('../models');

class TeacherRepository extends BaseRepository {
  constructor() {
    super(Teacher);
  }
}

module.exports = new TeacherRepository();
