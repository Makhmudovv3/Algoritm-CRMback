const BaseService = require('../../../services/baseService');
const followUpRepository = require('../repositories/followUp.repository');

class FollowUpService extends BaseService {
  constructor() {
    super(followUpRepository, ['notes', 'status']);
  }
}

module.exports = new FollowUpService();
