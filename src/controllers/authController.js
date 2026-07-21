const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class AuthController {
  async login(req, res) {
    try {
      const { phone, password } = req.body;
      const data = await authService.login(phone, password, req.ip);
      return successResponse(res, 'Login successful', data);
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      return errorResponse(res, error.message, [], 401);
    }
  }

  async register(req, res) {
    try {
      const data = await authService.register(req.body);
      return successResponse(res, 'Registration successful', data, {}, 201);
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      return errorResponse(res, error.message, [], 400);
    }
  }

  async refresh(req, res) {
    try {
      const { token } = req.body;
      const data = await authService.refresh(token);
      return successResponse(res, 'Token refreshed', data);
    } catch (error) {
      logger.error(`Refresh error: ${error.message}`);
      return errorResponse(res, error.message, [], 401);
    }
  }
}

module.exports = new AuthController();
