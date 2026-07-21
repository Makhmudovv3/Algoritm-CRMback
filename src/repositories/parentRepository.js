const BaseRepository = require('./baseRepository');
const { Parent } = require('../models');

class ParentRepository extends BaseRepository {
  constructor() {
    super(Parent);
  }
}

module.exports = new ParentRepository();
