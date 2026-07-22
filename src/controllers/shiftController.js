const BaseController = require('./baseController');
const shiftService = require('../services/shiftService');

class ShiftController extends BaseController {
  constructor() {
    super(shiftService, 'Shift');
  }
}

module.exports = new ShiftController();
