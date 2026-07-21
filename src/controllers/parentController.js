const BaseController = require('./baseController');
const parentService = require('../services/parentService');

class ParentController extends BaseController {
  constructor() {
    super(parentService, 'Parent');
  }
}

module.exports = new ParentController();
