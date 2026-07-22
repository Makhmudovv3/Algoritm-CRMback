const BaseService = require('./baseService');
const userRepository = require('../repositories/userRepository');

class UserService extends BaseService {
  constructor() {
    super(userRepository);
  }

  async create(data, userId, ipAddress) {
    // Format phone if needed
    if (data.phone) {
      data.phone = '+' + data.phone.replace(/\D/g, '');
    }
    const user = await super.create(data, userId, ipAddress);
    await this._syncTeacherRecord(user);
    return user;
  }

  async update(id, data, userId, ipAddress) {
    if (data.phone) {
      data.phone = '+' + data.phone.replace(/\D/g, '');
    }
    const user = await super.update(id, data, userId, ipAddress);
    await this._syncTeacherRecord(user);
    return user;
  }

  async _syncTeacherRecord(user) {
    const { Role, Teacher, Branch } = require('../models');
    if (!user || !user.roleId) return;

    const role = await Role.findByPk(user.roleId);
    if (role && role.name === 'TEACHER') {
      let branchId = user.branchId;
      if (!branchId) {
        const defaultBranch = await Branch.findOne();
        if (defaultBranch) branchId = defaultBranch.id;
      }
      
      const [teacher, created] = await Teacher.findOrCreate({
        where: { userId: user.id },
        defaults: { branchId: branchId }
      });
      
      if (!created && branchId && teacher.branchId !== branchId) {
        await teacher.update({ branchId: branchId });
      }
    }
  }
}

module.exports = new UserService();
