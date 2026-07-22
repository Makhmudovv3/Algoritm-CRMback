const BaseRepository = require('./baseRepository');
const { GroupAnnouncement } = require('../models');

class GroupAnnouncementRepository extends BaseRepository {
  constructor() {
    super(GroupAnnouncement);
  }
}

module.exports = new GroupAnnouncementRepository();
