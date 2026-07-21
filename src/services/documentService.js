const BaseService = require('./baseService');
const documentRepository = require('../repositories/documentRepository');

class DocumentService extends BaseService {
  constructor() {
    super(documentRepository, []);
  }
}

module.exports = new DocumentService();
