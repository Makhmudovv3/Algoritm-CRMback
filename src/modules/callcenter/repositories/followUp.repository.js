const BaseRepository = require('../../../repositories/baseRepository');
const { FollowUp } = require('../../../models');

class FollowUpRepository extends BaseRepository {
  constructor() {
    super(FollowUp);
  }
}

module.exports = new FollowUpRepository();
