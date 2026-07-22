const BaseService = require('./baseService');
const { StudentGroup } = require('../models');

class StudentGroupService extends BaseService {
  constructor() {
    super(StudentGroup);
  }
}

module.exports = new StudentGroupService();
