const BaseController = require('./baseController');
const eventService = require('../services/eventService');
const logger = require('../utils/logger');
const { errorResponse, successResponse } = require('../utils/response');
const notificationService = require('../services/notificationService');

class EventController extends BaseController {
  constructor() {
    super(eventService, 'Event');
  }

  create = async (req, res) => {
    try {
      if (req.user && req.user.id) {
        req.body.createdBy = req.user.id;
      }
      
      const record = await this.service.create(req.body, req.user?.id, req.ip);
      const io = req.app.get('io');
      
      await notificationService.notifyAdmins(io, {
        title: `New Event Created`,
        content: `A new event has been created.`,
        type: 'system',
        priority: 'medium',
        category: 'general'
      });

      return successResponse(res, `Event created successfully`, record, {}, 201);
    } catch (error) {
      logger.error(`Error in Event create: ${error.message}`);
      return errorResponse(res, `Failed to create event`, [error.message], 400);
    }
  };
}

module.exports = new EventController();
