const BaseRepository = require('./baseRepository');
const { Message } = require('../models');

class MessageRepository extends BaseRepository {
  constructor() {
    super(Message);
  }
}

module.exports = new MessageRepository();
