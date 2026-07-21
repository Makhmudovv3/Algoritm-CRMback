class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return await this.model.findAndCountAll(options);
  }

  async findById(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  async create(data, options = {}) {
    return await this.model.create(data, options);
  }

  async update(id, data, options = {}) {
    const record = await this.model.findByPk(id);
    if (!record) return null;
    return await record.update(data, options);
  }

  async delete(id, options = {}) {
    const record = await this.model.findByPk(id);
    if (!record) return null;
    await record.destroy(options);
    return true;
  }

  async restore(id, options = {}) {
    const record = await this.model.findByPk(id, { paranoid: false });
    if (!record) return null;
    await record.restore(options);
    return record;
  }
}

module.exports = BaseRepository;
