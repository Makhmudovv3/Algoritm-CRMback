const BaseService = require('./baseService');
const discountRepository = require('../repositories/discountRepository');

class DiscountService extends BaseService {
  constructor() {
    super(discountRepository, []);
  }
}

module.exports = new DiscountService();
