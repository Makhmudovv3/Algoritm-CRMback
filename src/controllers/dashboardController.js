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
}

module.exports = new DashboardController();
