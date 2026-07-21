const BaseRepository = require('./baseRepository');
const { Payment } = require('../models');

class PaymentRepository extends BaseRepository {
  constructor() {
    super(Payment);
  }
}

module.exports = new PaymentRepository();
