const BaseController = require('./baseController');
const teacherService = require('../services/teacherService');

class TeacherController extends BaseController {
  constructor() {
    super(teacherService, 'Teacher');
  }
}

module.exports = new TeacherController();
