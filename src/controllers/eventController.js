const BaseController = require('./baseController');
const eventService = require('../services/eventService');

class EventController extends BaseController {
  constructor() {
    super(eventService, 'Event');
  }
}

module.exports = new EventController();
