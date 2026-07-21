const BaseService = require('./baseService');
const paymentRepository = require('../repositories/paymentRepository');
const { Payment, Invoice, sequelize } = require('../models');

class PaymentService extends BaseService {
  constructor() {
    super(paymentRepository, []);
  }

  async create(data) {
    const t = await sequelize.transaction();
    try {
      const payment = await Payment.create(data, { transaction: t });
      
      const invoice = await Invoice.findByPk(data.invoiceId, { transaction: t });
      if (invoice) {
        // Simple logic to mark as paid
        // Real-world: check if sum of payments >= invoice amount
        await invoice.update({ status: 'PAID' }, { transaction: t });
      }

      await t.commit();
      return payment;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new PaymentService();
