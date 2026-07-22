const BaseService = require('./baseService');
const { PendingPayment } = require('../models');

class PendingPaymentService extends BaseService {
  constructor() {
    super(PendingPayment);
  }
}

module.exports = new PendingPaymentService();
