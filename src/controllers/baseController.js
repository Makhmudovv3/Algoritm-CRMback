const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class BaseController {
  constructor(service, entityName) {
    this.service = service;
    this.entityName = entityName;
  }

  getAll = async (req, res) => {
    try {
      // Apply branch isolation for managers
      if (req.user && (req.user.role === 'Manager' || req.user.role === 'BRANCH_MANAGER') && req.user.branchId) {
        req.query.branchId = req.user.branchId;
        if (!this.allowedFilters) this.allowedFilters = [];
        if (!this.allowedFilters.includes('branchId')) {
          this.allowedFilters.push('branchId');
        }
      }
      
      // Allow overriding allowed filters and sort fields via child controllers if needed
      // By default we pass generic filters from child or empty array
      const result = await this.service.getAll(req.query, this.allowedFilters || [], this.allowedSortFields || [], this.includeRelations || []);
      return successResponse(res, `${this.entityName}s retrieved successfully`, result.data, result.meta);
    } catch (error) {
      logger.error(`Error in ${this.entityName} getAll: ${error.message}`);
      return errorResponse(res, `Failed to retrieve ${this.entityName.toLowerCase()}s`, [error.message]);
    }
  };

  getById = async (req, res) => {
    try {
      const record = await this.service.getById(req.params.id, this.includeRelations || []);
      return successResponse(res, `${this.entityName} retrieved successfully`, record);
    } catch (error) {
      logger.error(`Error in ${this.entityName} getById: ${error.message}`);
      return errorResponse(res, `${this.entityName} not found`, [error.message], 404);
    }
  };

  create = async (req, res) => {
    try {
      const record = await this.service.create(req.body, req.user?.id, req.ip);
      const io = req.app.get('io');
      const notificationService = require('../services/notificationService');
      await notificationService.notifyAdmins(io, {
        title: `New ${this.entityName} Created`,
        content: `A new ${this.entityName.toLowerCase()} has been created.`,
        type: 'system',
        priority: 'medium',
        category: 'general'
      });
      return successResponse(res, `${this.entityName} created successfully`, record, {}, 201);
    } catch (error) {
      logger.error(`Error in ${this.entityName} create: ${error.message}`);
      const errorDetails = error.errors ? error.errors.map(e => e.message) : [error.message];
      return errorResponse(res, `Failed to create ${this.entityName.toLowerCase()}`, errorDetails, 400);
    }
  };

  update = async (req, res) => {
    try {
      const record = await this.service.update(req.params.id, req.body, req.user?.id, req.ip);
      const io = req.app.get('io');
      const notificationService = require('../services/notificationService');
      await notificationService.notifyAdmins(io, {
        title: `${this.entityName} Updated`,
        content: `A ${this.entityName.toLowerCase()} record was updated.`,
        type: 'system',
        priority: 'low',
        category: 'general'
      });
      return successResponse(res, `${this.entityName} updated successfully`, record);
    } catch (error) {
      logger.error(`Error in ${this.entityName} update: ${error.message}`);
      const errorDetails = error.errors ? error.errors.map(e => e.message) : [error.message];
      return errorResponse(res, `Failed to update ${this.entityName.toLowerCase()}`, errorDetails, 400);
    }
  };

  delete = async (req, res) => {
    try {
      await this.service.delete(req.params.id, req.user?.id, req.ip);
      const io = req.app.get('io');
      const notificationService = require('../services/notificationService');
      await notificationService.notifyAdmins(io, {
        title: `${this.entityName} Deleted`,
        content: `A ${this.entityName.toLowerCase()} record was deleted.`,
        type: 'system',
        priority: 'high',
        category: 'general'
      });
      return successResponse(res, `${this.entityName} deleted successfully`);
    } catch (error) {
      logger.error(`Error in ${this.entityName} delete: ${error.message}`);
      return errorResponse(res, `Failed to delete ${this.entityName.toLowerCase()}`, [error.message], 400);
    }
  };
}

module.exports = BaseController;
