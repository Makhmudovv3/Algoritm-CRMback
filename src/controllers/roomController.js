const BaseController = require('./baseController');
const roomService = require('../services/roomService');
const { Branch } = require('../models');

class RoomController extends BaseController {
  constructor() {
    super(roomService, 'Room');
    this.includeRelations = [
      { model: Branch, as: 'branch' }
    ];
  }
}
module.exports = new RoomController();
