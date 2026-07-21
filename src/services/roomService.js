const BaseService = require('./baseService');
const roomRepository = require('../repositories/roomRepository');

class RoomService extends BaseService {
  constructor() {
    super(roomRepository, ['name']); // adjust searchable fields later
  }
}

module.exports = new RoomService();
