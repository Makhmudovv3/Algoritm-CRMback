const BaseRepository = require('./baseRepository');
const { Branch } = require('../models');

class BranchRepository extends BaseRepository {
  constructor() {
    super(Branch);
  }
}

module.exports = new BranchRepository();
