const BaseController = require('./baseController');
const paymentRequestLogService = require('../services/paymentRequestLogService');

class PaymentRequestLogController extends BaseController {
  constructor() {
    super(paymentRequestLogService, 'PaymentRequestLog');
  }
}

module.exports = new PaymentRequestLogController();
