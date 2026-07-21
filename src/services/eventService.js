const BaseService = require('./baseService');
const eventRepository = require('../repositories/eventRepository');

class EventService extends BaseService {
  constructor() {
    super(eventRepository, []);
  }
}

module.exports = new EventService();
