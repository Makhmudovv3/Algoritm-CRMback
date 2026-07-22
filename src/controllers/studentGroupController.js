const BaseController = require('./baseController');
const studentGroupService = require('../services/studentGroupService');

class StudentGroupController extends BaseController {
  constructor() {
    super(studentGroupService, 'StudentGroup');
  }
}

module.exports = new StudentGroupController();
