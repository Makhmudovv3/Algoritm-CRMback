const BaseService = require('./baseService');
const courseRepository = require('../repositories/courseRepository');

class CourseService extends BaseService {
  constructor() {
    super(courseRepository, ['name']); // adjust searchable fields later
  }
}

module.exports = new CourseService();
