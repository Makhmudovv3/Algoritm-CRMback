const BaseController = require('./baseController');
const invoiceService = require('../services/invoiceService');

class InvoiceController extends BaseController {
  constructor() {
    super(invoiceService, 'Invoice');
  }
}

module.exports = new InvoiceController();
