const BaseService = require('./baseService');
const studentRepository = require('../repositories/studentRepository');
const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');

class StudentService extends BaseService {
  constructor() {
    super(studentRepository, ['id']); 
  }

  async create(data, reqUserId = null, reqIp = null) {
    let role = await roleRepository.findByName('STUDENT');
    if (!role) {
      role = await roleRepository.create({ name: 'STUDENT', description: 'Student' });
    }

    const nameParts = (data.fullname || '').split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create User first
    const user = await userRepository.create({
      firstName,
      lastName,
      phone: data.phone,
      email: data.email || null,
      roleId: role.id,
      password: data.phone ? data.phone.slice(-4) : '1234'
    });

    // Parent handling
    let parentId = null;
    let parentRecord = null;
    if (data.parent_name && data.parent_phone) {
      let parentRole = await roleRepository.findByName('PARENT');
      if (!parentRole) {
        parentRole = await roleRepository.create({ name: 'PARENT', description: 'Parent' });
      }
      const parentNameParts = data.parent_name.split(' ');
      const parentUser = await userRepository.create({
        firstName: parentNameParts[0] || 'Unknown',
        lastName: parentNameParts.slice(1).join(' ') || '',
        phone: data.parent_phone,
        roleId: parentRole.id,
        password: data.parent_phone.slice(-4)
      });
      const { Parent } = require('../models');
      parentRecord = await Parent.create({ userId: parentUser.id });
      parentId = parentRecord.id;
    }

    // Create Student referencing the user and parent
    const student = await super.create({
      userId: user.id,
      branchId: data.branchId,
      dateOfBirth: data.birthday || null,
      parentId: parentId
    }, reqUserId, reqIp);
    
    // Add User data to student for frontend mapping
    student.dataValues.user = user;
    if (parentRecord) {
      student.dataValues.parent = parentRecord;
    }
    return student;
  }

  async getAll(query, allowedFilters = [], allowedSortFields = [], include = []) {
    const { User, Parent, Branch } = require('../models');
    return super.getAll(query, allowedFilters, allowedSortFields, [
      { model: User, as: 'user' },
      { model: Parent, as: 'parent' },
      { model: Branch, as: 'branch' }
    ]);
  }

  async getById(id) {
    const { User, Parent, Branch } = require('../models');
    return super.getById(id, [
      { model: User, as: 'user' },
      { model: Parent, as: 'parent' },
      { model: Branch, as: 'branch' }
    ]);
  }
}

module.exports = new StudentService();
