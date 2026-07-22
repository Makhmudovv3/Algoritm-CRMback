const BaseService = require('./baseService');
const { Shift } = require('../models');

class ShiftService extends BaseService {
  constructor() {
    super(Shift);
  }
}

module.exports = new ShiftService();
