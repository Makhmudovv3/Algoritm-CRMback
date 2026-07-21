const { Role } = require('../models');

const BaseRepository = require('./baseRepository');

class RoleRepository extends BaseRepository {
  constructor() {
    super(Role);
  }

  async findByName(name) {
    return await Role.findOne({ where: { name } });
  }

  async create(roleData) {
    return await Role.create(roleData);
  }
}

module.exports = new RoleRepository();
