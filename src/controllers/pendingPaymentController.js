const BaseController = require('./baseController');
const pendingPaymentService = require('../services/pendingPaymentService');

class PendingPaymentController extends BaseController {
  constructor() {
    super(pendingPaymentService, 'PendingPayment');
  }
}

module.exports = new PendingPaymentController();
