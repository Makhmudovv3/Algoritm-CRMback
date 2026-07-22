const BaseController = require('./baseController');
const paymentRequestService = require('../services/paymentRequestService');

class PaymentRequestController extends BaseController {
  constructor() {
    super(paymentRequestService, 'PaymentRequest');
  }
}

module.exports = new PaymentRequestController();
