const BaseService = require('./baseService');
const grantRepository = require('../repositories/grantRepository');

class GrantService extends BaseService {
  constructor() {
    super(grantRepository, []);
  }
}

module.exports = new GrantService();
