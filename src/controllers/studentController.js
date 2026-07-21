const BaseController = require('./baseController');
const studentService = require('../services/studentService');

class StudentController extends BaseController {
  constructor() {
    super(studentService, 'Student');
  }
}

module.exports = new StudentController();
