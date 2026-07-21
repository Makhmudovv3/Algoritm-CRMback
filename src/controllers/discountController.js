const BaseController = require('./baseController');
const discountService = require('../services/discountService');

class DiscountController extends BaseController {
  constructor() {
    super(discountService, 'Discount');
  }
}

module.exports = new DiscountController();
