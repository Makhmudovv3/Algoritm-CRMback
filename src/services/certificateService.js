const BaseService = require('./baseService');
const certificateRepository = require('../repositories/certificateRepository');

class CertificateService extends BaseService {
  constructor() {
    super(certificateRepository, []);
  }
}

module.exports = new CertificateService();
