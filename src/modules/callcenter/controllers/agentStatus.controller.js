const BaseController = require('../../../controllers/baseController');
const agentStatusService = require('../services/agentStatus.service');

class AgentStatusController extends BaseController {
  constructor() {
    super(agentStatusService, 'AgentStatus');
  }
}

module.exports = new AgentStatusController();
