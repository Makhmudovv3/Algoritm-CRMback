const BaseService = require('./baseService');
const parentRepository = require('../repositories/parentRepository');
const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');

class ParentService extends BaseService {
  constructor() {
    super(parentRepository, ['id']);
  }

  async create(data, reqUserId = null, reqIp = null) {
    let role = await roleRepository.findByName('PARENT');
    if (!role) {
      role = await roleRepository.create({ name: 'PARENT', description: 'Parent' });
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

    // Create Parent referencing the user
    const parent = await super.create({
      userId: user.id
    }, reqUserId, reqIp);
    
    parent.dataValues.user = user;
    return parent;
  }

  async getAll(query, allowedFilters = [], allowedSortFields = [], include = []) {
    const { User, Student } = require('../models');
    return super.getAll(query, allowedFilters, allowedSortFields, [
      { model: User, as: 'user' },
      { model: Student, as: 'students' }
    ]);
  }

  async getById(id) {
    const { User, Student } = require('../models');
    return super.getById(id, [
      { model: User, as: 'user' },
      { model: Student, as: 'students' }
    ]);
  }
}

module.exports = new ParentService();
