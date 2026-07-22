const dashboardService = require('../services/dashboardService');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class DashboardController {
  async getDashboard(req, res) {
    try {
      const data = await dashboardService.getStats(req.user);
      return successResponse(res, 'Dashboard data retrieved successfully', data);
    } catch (error) {
      logger.error(`Dashboard error: ${error.message}`);
      return errorResponse(res, 'Failed to fetch dashboard data', [error.message], 400);
    }
  }

  async getAll(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  async getById(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  async create(req, res) {
    return res.status(201).json({ success: true, message: 'Not Implemented' });
  }
  async update(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  async delete(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }

}
module.exports = new DashboardController();
