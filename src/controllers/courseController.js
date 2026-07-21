const BaseController = require('./baseController');
const courseService = require('../services/courseService');

class CourseController extends BaseController {
  constructor() {
    super(courseService, 'Course');
  }
}

module.exports = new CourseController();
