const BaseRepository = require('./baseRepository');
const { Discount } = require('../models');

class DiscountRepository extends BaseRepository {
  constructor() {
    super(Discount);
  }
}

module.exports = new DiscountRepository();
