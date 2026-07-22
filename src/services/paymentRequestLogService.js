const BaseService = require('./baseService');
const { PaymentRequestLog } = require('../models');

class PaymentRequestLogService extends BaseService {
  constructor() {
    super(PaymentRequestLog);
  }
}

module.exports = new PaymentRequestLogService();
