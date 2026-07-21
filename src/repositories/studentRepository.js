const BaseRepository = require('./baseRepository');
const { Student } = require('../models');

class StudentRepository extends BaseRepository {
  constructor() {
    super(Student);
  }
}

module.exports = new StudentRepository();
