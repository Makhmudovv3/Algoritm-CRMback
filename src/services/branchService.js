const BaseService = require('./baseService');
const branchRepository = require('../repositories/branchRepository');

class BranchService extends BaseService {
  constructor() {
    super(branchRepository, ['name']); // adjust searchable fields later
  }
}

module.exports = new BranchService();
