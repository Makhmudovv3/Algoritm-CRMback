const BaseService = require('./baseService');
const messageRepository = require('../repositories/messageRepository');

class MessageService extends BaseService {
  constructor() {
    super(messageRepository, []);
  }
}

module.exports = new MessageService();
