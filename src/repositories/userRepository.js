const { User, Role } = require('../models');

const BaseRepository = require('./baseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }]
    });
  }

  async findByPhone(phone) {
    return await User.findOne({
      where: { phone },
      include: [{ model: Role, as: 'role' }]
    });
  }

  async findById(id) {
    return await User.findByPk(id, {
      include: [{ model: Role, as: 'role' }]
    });
  }
}

module.exports = new UserRepository();
