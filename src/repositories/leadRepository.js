const BaseRepository = require('./baseRepository');
const { Lead } = require('../models');

class LeadRepository extends BaseRepository {
  constructor() {
    super(Lead);
  }
}

module.exports = new LeadRepository();
