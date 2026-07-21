const BaseRepository = require('../../../repositories/baseRepository');
const { AgentStatus } = require('../../../models');

class AgentStatusRepository extends BaseRepository {
  constructor() {
    super(AgentStatus);
  }
}

module.exports = new AgentStatusRepository();
