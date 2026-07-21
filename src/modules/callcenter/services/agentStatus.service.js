const BaseService = require('../../../services/baseService');
const agentStatusRepository = require('../repositories/agentStatus.repository');

class AgentStatusService extends BaseService {
  constructor() {
    super(agentStatusRepository, ['status']);
  }
}

module.exports = new AgentStatusService();
