const BaseRepository = require('./baseRepository');
const { StudentTransfer } = require('../models');

class StudentTransferRepository extends BaseRepository {
  constructor() {
    super(StudentTransfer);
  }
}

module.exports = new StudentTransferRepository();
