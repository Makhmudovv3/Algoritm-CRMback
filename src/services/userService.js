const BaseService = require('./baseService');
const userRepository = require('../repositories/userRepository');

class UserService extends BaseService {
  constructor() {
    super(userRepository);
  }
}

module.exports = new UserService();
