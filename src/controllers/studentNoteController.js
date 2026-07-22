const BaseController = require('./baseController');
const studentNoteService = require('../services/studentNoteService');

class StudentNoteController extends BaseController {
  constructor() {
    super(studentNoteService, 'StudentNote');
  }
}

module.exports = new StudentNoteController();
