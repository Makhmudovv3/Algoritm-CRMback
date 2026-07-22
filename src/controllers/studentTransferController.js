const BaseController = require('./baseController');
const studentTransferService = require('../services/studentTransferService');

class StudentTransferController extends BaseController {
  constructor() {
    super(studentTransferService, 'StudentTransfer');
  }
}

module.exports = new StudentTransferController();
