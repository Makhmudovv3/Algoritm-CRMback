const BaseRepository = require('./baseRepository');
const { Invoice } = require('../models');

class InvoiceRepository extends BaseRepository {
  constructor() {
    super(Invoice);
  }
}

module.exports = new InvoiceRepository();
