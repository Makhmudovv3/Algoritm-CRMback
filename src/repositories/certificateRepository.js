const BaseRepository = require('./baseRepository');
const { Certificate } = require('../models');

class CertificateRepository extends BaseRepository {
  constructor() {
    super(Certificate);
  }
}

module.exports = new CertificateRepository();
