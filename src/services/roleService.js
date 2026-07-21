const BaseService = require('./baseService');
const roleRepository = require('../repositories/roleRepository');

class RoleService extends BaseService {
  constructor() {
    super(roleRepository);
  }

  async delete(id, reqUserId = null, reqIp = null) {
    const { User } = require('../models');
    // Check if any user (even soft-deleted) has this role
    const usersWithRole = await User.count({ where: { roleId: id }, paranoid: false });
    if (usersWithRole > 0) {
      throw new Error('Ushbu rolni o\'chirish mumkin emas, unga biriktirilgan foydalanuvchilar mavjud');
    }
    return super.delete(id, reqUserId, reqIp);
  }
}

module.exports = new RoleService();
