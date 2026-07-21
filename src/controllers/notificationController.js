const BaseController = require('./baseController');
const notificationService = require('../services/notificationService');
const { successResponse, errorResponse } = require('../utils/response');

class NotificationController extends BaseController {
  constructor() {
    super(notificationService, 'Notification');
  }

  create = async (req, res) => {
    try {
      const record = await this.service.create(req.body);
      const io = req.app.get('io');
      if (io) {
        io.emit(`notification_${record.userId}`, record);
      }
      return successResponse(res, `Notification created successfully`, record, {}, 201);
    } catch (error) {
      return errorResponse(res, `Failed to create notification`, [error.message], 400);
    }
  };
}

module.exports = new NotificationController();
