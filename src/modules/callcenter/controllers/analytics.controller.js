const analyticsService = require('../services/analytics.service');
const { successResponse, errorResponse } = require('../../../utils/response');

class AnalyticsController {
  async getDashboardStats(req, res) {
    try {
      const stats = await analyticsService.getDashboardStats(req.query);
      return successResponse(res, 'Call Center Dashboard Stats retrieved', stats);
    } catch (error) {
      console.error(error);
      return errorResponse(res, 'Failed to fetch analytics', error.message, 500);
    }
  }
}

module.exports = new AnalyticsController();
