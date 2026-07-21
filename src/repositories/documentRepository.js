const BaseRepository = require('./baseRepository');
const { Document } = require('../models');

class DocumentRepository extends BaseRepository {
  constructor() {
    super(Document);
  }
}

module.exports = new DocumentRepository();
