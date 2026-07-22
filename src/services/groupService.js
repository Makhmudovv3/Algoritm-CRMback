const BaseService = require('./baseService');
const groupRepository = require('../repositories/groupRepository');

class GroupService extends BaseService {
  constructor() {
    super(groupRepository, ['name']);
  }

  async create(data, reqUserId = null, reqIp = null) {
    let finalBranchId = data.branch_id || data.branchId;
    let finalCapacity = data.capacity;
    
    // Auto-derive branchId from room if missing
    if (!finalBranchId && (data.room_id || data.roomId)) {
      const { Room } = require('../models');
      const room = await Room.findByPk(data.room_id || data.roomId);
      if (room) {
        finalBranchId = room.branchId;
        if (!finalCapacity) finalCapacity = room.capacity;
      }
    }

    const payload = {
      ...data,
      courseId: data.course_id || data.courseId,
      teacherId: data.teacher_id || data.teacherId,
      roomId: data.room_id || data.roomId,
      branchId: finalBranchId,
      capacity: finalCapacity ? parseInt(finalCapacity) : null
    };
    
    // Remove empty strings for dates to prevent Sequelize validation errors
    if (payload.startDate === '') payload.startDate = null;
    if (payload.endDate === '') payload.endDate = null;
    if (payload.start_date === '') delete payload.start_date;
    
    return super.create(payload, reqUserId, reqIp);
  }

  async update(id, data, reqUserId = null, reqIp = null) {
    const payload = {
      ...data,
      courseId: data.course_id || data.courseId,
      teacherId: data.teacher_id || data.teacherId,
      roomId: data.room_id || data.roomId,
      branchId: data.branch_id || data.branchId
    };
    return super.update(id, payload, reqUserId, reqIp);
  }

  async getAll(query, allowedFilters = [], allowedSortFields = [], include = []) {
    const { Course, Teacher, Room, Branch } = require('../models');
    return super.getAll(query, allowedFilters, allowedSortFields, [
      { model: Course, as: 'course' },
      { model: Teacher, as: 'teacher' },
      { model: Room, as: 'room' },
      { model: Branch, as: 'branch' }
    ]);
  }

  async getById(id) {
    const { Course, Teacher, Room, Branch } = require('../models');
    return super.getById(id, [
      { model: Course, as: 'course' },
      { model: Teacher, as: 'teacher' },
      { model: Room, as: 'room' },
      { model: Branch, as: 'branch' }
    ]);
  }
}

module.exports = new GroupService();
