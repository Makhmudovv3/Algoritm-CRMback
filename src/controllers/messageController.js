const BaseController = require('./baseController');
const messageService = require('../services/messageService');
const { successResponse, errorResponse } = require('../utils/response');

class MessageController extends BaseController {
  constructor() {
    super(messageService, 'Message');
  }

  create = async (req, res) => {
    try {
      const record = await this.service.create(req.body);
      const io = req.app.get('io');
      if (io) {
        io.emit(`message_${record.receiverId}`, record);
      }
      return successResponse(res, `Message created successfully`, record, {}, 201);
    } catch (error) {
      return errorResponse(res, `Failed to create message`, [error.message], 400);
    }
  };
}

module.exports = new MessageController();
