const BaseController = require('./baseController');
const paymentService = require('../services/paymentService');

class PaymentController extends BaseController {
  constructor() {
    super(paymentService, 'Payment');
  }
}

module.exports = new PaymentController();
