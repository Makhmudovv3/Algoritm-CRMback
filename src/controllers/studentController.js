const BaseController = require('./baseController');
const studentService = require('../services/studentService');

class StudentController extends BaseController {
  constructor() {
    super(studentService, 'Student');
    this.allowedFilters = ['userId', 'branchId', 'groupId', 'parentId'];
  }
}

module.exports = new StudentController();
