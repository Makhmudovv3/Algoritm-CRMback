const BaseController = require('./baseController');
const eventService = require('../services/eventService');
const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');

class EventController extends BaseController {
  constructor() {
    super(eventService, 'Event');
  }

  create = async (req, res) => {
    try {
      if (req.user && req.user.id) {
        req.body.createdBy = req.user.id;
      }
      return await super.create(req, res);
    } catch (error) {
      logger.error(`Error in Event create: ${error.message}`);
      return errorResponse(res, `Failed to create event`, [error.message], 400);
    }
  };
}

module.exports = new EventController();
