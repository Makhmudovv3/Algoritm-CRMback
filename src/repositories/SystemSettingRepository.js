const BaseRepository = require('./baseRepository');
const { SystemSetting } = require('../models');

class SystemSettingRepository extends BaseRepository {
  constructor() {
    super(SystemSetting);
  }

  async getByCategory(category) {
    return await this.model.findAll({
      where: { category }
    });
  }

  async getByKey(key) {
    return await this.model.findOne({
      where: { key }
    });
  }

  async updateBulk(settings, transaction) {
    const promises = settings.map(setting => {
      return this.model.update(
        { value: setting.value, updatedBy: setting.updatedBy },
        { where: { key: setting.key }, transaction }
      );
    });
    await Promise.all(promises);
  }
}

module.exports = new SystemSettingRepository();
