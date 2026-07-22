const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class AuthController {
  setCookies(res, tokens) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days for refresh token
    };
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    
    // Optional: we can also set accessToken in a shorter lived cookie
    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000 // 1 hour
    });
  }

  async login(req, res) {
    try {
      const { phone, password } = req.body;
      const data = await authService.login(phone, password, req.ip);
      
      this.setCookies(res, { accessToken: data.accessToken, refreshToken: data.refreshToken });
      
      return successResponse(res, 'Login successful', data);
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      return errorResponse(res, error.message, [], 401);
    }
  }

  async register(req, res) {
    try {
      const data = await authService.register(req.body);
      
      this.setCookies(res, { accessToken: data.accessToken, refreshToken: data.refreshToken });
      
      return successResponse(res, 'Registration successful', data, {}, 201);
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      return errorResponse(res, error.message, [], 400);
    }
  }

  async refresh(req, res) {
    try {
      const token = req.cookies?.refreshToken || req.body.token;
      if (!token) throw new Error('No refresh token provided');

      const data = await authService.refresh(token);
      
      this.setCookies(res, data); // data contains new accessToken and refreshToken
      
      return successResponse(res, 'Token refreshed', data);
    } catch (error) {
      logger.error(`Refresh error: ${error.message}`);
      return errorResponse(res, error.message, [], 401);
    }
  }

  async logout(req, res) {
    res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'none' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });
    return successResponse(res, 'Logged out successfully');
  }
}

module.exports = new AuthController();
