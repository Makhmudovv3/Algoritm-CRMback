const BaseRepository = require('./baseRepository');
const { Course } = require('../models');

class CourseRepository extends BaseRepository {
  constructor() {
    super(Course);
  }
}

module.exports = new CourseRepository();
