const BaseController = require('./baseController');
const userService = require('../services/userService');

class UserController extends BaseController {
  constructor() {
    super(userService, 'User');
  }
}

module.exports = new UserController();
