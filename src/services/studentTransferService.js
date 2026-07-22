const BaseService = require('./baseService');
const studentTransferRepository = require('../repositories/studentTransferRepository');

class StudentTransferService extends BaseService {
  constructor() {
    super(studentTransferRepository);
  }
}

module.exports = new StudentTransferService();
