const BaseService = require('./baseService');
const teacherRepository = require('../repositories/teacherRepository');
const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');

class TeacherService extends BaseService {
  constructor() {
    super(teacherRepository, ['id']);
  }

  async create(data, reqUserId = null, reqIp = null) {
    let role = await roleRepository.findByName('TEACHER');
    if (!role) {
      role = await roleRepository.create({ name: 'TEACHER', description: 'Teacher' });
    }

    const nameParts = (data.fullname || data.firstName || '').split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || data.lastName || '';

    // Create User first
    const user = await userRepository.create({
      firstName,
      lastName,
      phone: data.phone,
      email: data.email || null,
      roleId: role.id,
      password: data.phone ? data.phone.slice(-4) : '1234'
    });

    // Create Teacher referencing the user
    const teacher = await super.create({
      userId: user.id,
      branchId: data.branchId, // Need branchId from frontend
      salaryPerStudent: data.salaryPerStudent || 0,
      specialties: data.specialties || ''
    }, reqUserId, reqIp);
    
    teacher.dataValues.user = user;
    return teacher;
  }

  async getAll(query, allowedFilters = [], allowedSortFields = [], include = []) {
    const { User, Branch, Group } = require('../models');
    return super.getAll(query, allowedFilters, allowedSortFields, [
      { model: User, as: 'user' },
      { model: Branch, as: 'branch' },
      { model: Group, as: 'groups' }
    ]);
  }

  async getById(id) {
    const { User, Branch, Group } = require('../models');
    return super.getById(id, [
      { model: User, as: 'user' },
      { model: Branch, as: 'branch' },
      { model: Group, as: 'groups' }
    ]);
  }
}

module.exports = new TeacherService();
