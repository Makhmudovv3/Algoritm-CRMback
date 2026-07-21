const searchService = require('../services/searchService');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class SearchController {
  async globalSearch(req, res) {
    try {
      const data = await searchService.globalSearch(req.query);
      return successResponse(res, 'Global search results', data);
    } catch (error) {
      logger.error(`Search error: ${error.message}`);
      return errorResponse(res, 'Failed to perform global search', [error.message], 400);
    }
  }
}

module.exports = new SearchController();
