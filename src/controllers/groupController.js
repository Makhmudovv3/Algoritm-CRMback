const BaseController = require('./baseController');
const groupService = require('../services/groupService');
const { Course, Teacher, Room, Branch } = require('../models');

class GroupController extends BaseController {
  constructor() {
    super(groupService, 'Group');
    this.includeRelations = [
      { model: Course, as: 'course' },
      { model: Teacher, as: 'teacher' },
      { model: Room, as: 'room' },
      { model: Branch, as: 'branch' }
    ];
  }
}
module.exports = new GroupController();
