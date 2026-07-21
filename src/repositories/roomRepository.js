const BaseRepository = require('./baseRepository');
const { Room } = require('../models');

class RoomRepository extends BaseRepository {
  constructor() {
    super(Room);
  }
}

module.exports = new RoomRepository();
