const BaseService = require('./baseService');
const invoiceRepository = require('../repositories/invoiceRepository');
const { Invoice, sequelize } = require('../models');

class InvoiceService extends BaseService {
  constructor() {
    super(invoiceRepository, []);
  }

  async create(data) {
    let dbStatus = 'PENDING';
    if (data.status === 'paid' || data.status === 'PAID') dbStatus = 'PAID';
    if (data.status === 'partial') dbStatus = 'PENDING'; // no PARTIAL in DB yet
    
    const payload = {
      ...data,
      studentId: data.student_id || data.studentId,
      groupId: data.group_id || data.groupId,
      dueDate: data.due_date || data.dueDate || new Date().toISOString(),
      status: dbStatus
    };
    const t = await sequelize.transaction();
    try {
      const invoice = await Invoice.create(payload, { transaction: t });
      // You can add more complex logic here, e.g., applying grants/discounts
      await t.commit();
      return invoice;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new InvoiceService();
