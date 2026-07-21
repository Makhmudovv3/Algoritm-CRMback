const BaseController = require('./baseController');
const branchService = require('../services/branchService');

class BranchController extends BaseController {
  constructor() {
    super(branchService, 'Branch');
  }
}

module.exports = new BranchController();
