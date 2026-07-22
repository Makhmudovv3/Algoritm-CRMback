const BaseService = require('./baseService');
const { PaymentRequest } = require('../models');

class PaymentRequestService extends BaseService {
  constructor() {
    super(PaymentRequest);
  }
}

module.exports = new PaymentRequestService();
