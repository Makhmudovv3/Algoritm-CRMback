const BaseRepository = require('./baseRepository');
const { Group } = require('../models');

class GroupRepository extends BaseRepository {
  constructor() {
    super(Group);
  }
}

module.exports = new GroupRepository();
