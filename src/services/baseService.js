const { Op } = require('sequelize');

class BaseService {
  constructor(repository, searchableFields = []) {
    this.repository = repository;
    this.searchableFields = searchableFields;
  }

  async getPaginationOptions(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    return { limit, offset, page };
  }

  async getSearchOptions(query) {
    const search = query.search || '';
    if (!search || this.searchableFields.length === 0) return {};

    const orConditions = this.searchableFields.map(field => ({
      [field]: { [Op.iLike]: `%${search}%` }
    }));

    return { [Op.or]: orConditions };
  }

  async getFilterOptions(query, allowedFilters = []) {
    const filters = {};
    for (const key of Object.keys(query)) {
      if (allowedFilters.includes(key)) {
        filters[key] = query[key];
      }
    }
    return filters;
  }

  async getSortOptions(query, allowedSortFields = []) {
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder && query.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    if (allowedSortFields.includes(sortBy)) {
      return [[sortBy, sortOrder]];
    }
    return [['createdAt', 'DESC']];
  }

  async getAll(query, allowedFilters = [], allowedSortFields = [], include = []) {
    const { limit, offset, page } = await this.getPaginationOptions(query);
    const searchOptions = await this.getSearchOptions(query);
    const filterOptions = await this.getFilterOptions(query, allowedFilters);
    const order = await this.getSortOptions(query, allowedSortFields);

    const where = { ...searchOptions, ...filterOptions };

    const { count, rows } = await this.repository.findAll({
      where,
      limit,
      offset,
      order,
      include
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getById(id, include = []) {
    const record = await this.repository.findById(id, { include });
    if (!record) throw new Error('Record not found');
    return record;
  }

  async create(data, reqUserId = null, reqIp = null) {
    const record = await this.repository.create(data);
    if (reqUserId) {
      const { AuditLog } = require('../models');
      await AuditLog.create({
        userId: reqUserId,
        action: 'CREATE',
        entity: this.repository.model.name,
        entityId: record.id,
        ipAddress: reqIp
      });
    }
    return record;
  }

  async update(id, data, reqUserId = null, reqIp = null) {
    const updated = await this.repository.update(id, data);
    if (!updated) throw new Error('Record not found or could not be updated');
    if (reqUserId) {
      const { AuditLog } = require('../models');
      await AuditLog.create({
        userId: reqUserId,
        action: 'UPDATE',
        entity: this.repository.model.name,
        entityId: id,
        ipAddress: reqIp
      });
    }
    return updated;
  }

  async delete(id, reqUserId = null, reqIp = null) {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new Error('Record not found or could not be deleted');
    if (reqUserId) {
      const { AuditLog } = require('../models');
      await AuditLog.create({
        userId: reqUserId,
        action: 'DELETE',
        entity: this.repository.model.name,
        entityId: id,
        ipAddress: reqIp
      });
    }
    return deleted;
  }
}

module.exports = BaseService;
