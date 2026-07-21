const BaseRepository = require('./baseRepository');
const { Grant } = require('../models');

class GrantRepository extends BaseRepository {
  constructor() {
    super(Grant);
  }
}

module.exports = new GrantRepository();
