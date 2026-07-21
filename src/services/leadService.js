const BaseService = require('./baseService');
const leadRepository = require('../repositories/leadRepository');

class LeadService extends BaseService {
  constructor() {
    super(leadRepository, ['name']); // adjust searchable fields later
  }
}

module.exports = new LeadService();
