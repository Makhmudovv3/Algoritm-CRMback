const BaseService = require('./baseService');
const groupAnnouncementRepository = require('../repositories/groupAnnouncementRepository');

class GroupAnnouncementService extends BaseService {
  constructor() {
    super(groupAnnouncementRepository, ['title', 'message']);
  }
}

module.exports = new GroupAnnouncementService();
