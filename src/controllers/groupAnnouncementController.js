const BaseController = require('./baseController');
const groupAnnouncementService = require('../services/groupAnnouncementService');

class GroupAnnouncementController extends BaseController {
  constructor() {
    super(groupAnnouncementService, 'GroupAnnouncement');
  }
}

module.exports = new GroupAnnouncementController();
