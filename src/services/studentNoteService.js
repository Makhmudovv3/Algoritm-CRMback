const BaseService = require('./baseService');
const { StudentNote } = require('../models');

class StudentNoteService extends BaseService {
  constructor() {
    super(StudentNote);
  }
}

module.exports = new StudentNoteService();
