const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');
const crypto = require('crypto');
const { AuthSession, AuditLog } = require('../models');

class AuthController {
  setCookies(res, tokens) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Refresh Token: 30 days
    const refreshCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    };
    res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);
    
    // Optional: Access token in cookie or just return in body. Returning in body is fine, 
    // but the instruction says "Refresh Token faqat HttpOnly Secure Cookie orqali saqlansin. LocalStorage'da token saqlanmasin." 
    // Usually access token is kept in memory. We won't set it in cookie unless specified, but to be safe for "LocalStorage'da saqlanmasin", we can set it in cookie too or expect client to keep it in state. 
    // Let's set it in cookie as well so the frontend has an easy time not storing it anywhere.
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
  }

  login = async (req, res) => {
    try {
      const { phone, password, captchaToken } = req.body;
      const userAgent = {
        browser: req.headers['user-agent'] || 'Unknown',
        device: 'Unknown',
        os: 'Unknown'
      };
      
      const data = await authService.login(phone, password, req.ip, userAgent, captchaToken);
      
      this.setCookies(res, { accessToken: data.accessToken, refreshToken: data.refreshToken });
      
      // We don't return tokens in body to strictly enforce HttpOnly cookies as requested
      return successResponse(res, 'Login successful', { user: data.user });
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      if (error.isCaptchaRequired) {
        return res.status(400).json({ success: false, message: error.message, requireCaptcha: true });
      }
      return errorResponse(res, error.message, [], 401);
    }
  }

  register = async (req, res) => {
    try {
      const data = await authService.register(req.body);
      this.setCookies(res, { accessToken: data.accessToken, refreshToken: data.refreshToken });
      return successResponse(res, 'Registration successful', { user: data.user }, {}, 201);
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      return errorResponse(res, error.message, [], 400);
    }
  }

  refresh = async (req, res) => {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) throw new Error('No refresh token provided in cookies');

      const userAgent = {
        browser: req.headers['user-agent'] || 'Unknown',
        device: 'Unknown',
        os: 'Unknown'
      };

      const tokens = await authService.refresh(token, req.ip, userAgent);
      this.setCookies(res, tokens);
      
      return successResponse(res, 'Token refreshed successfully');
    } catch (error) {
      logger.error(`Refresh error: ${error.message}`);
      // Agar refresh o'xshamasa, cookie larni tozalab tashlaymiz
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return errorResponse(res, error.message, [], 401);
    }
  }

  logout = async (req, res) => {
    try {
      const token = req.cookies?.refreshToken;
      if (token) {
        const hash = crypto.createHash('sha256').update(token).digest('hex');
        await AuthSession.update({ isActive: false }, { where: { refreshTokenHash: hash } });
      }
      
      if (req.user) {
        await AuditLog.create({
          userId: req.user.id, action: 'LOGOUT', entity: 'User', entityId: req.user.id, ipAddress: req.ip
        });
      }

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return successResponse(res, 'Logged out successfully');
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return errorResponse(res, 'Logout failed', [], 400);
    }
  }
  getSessions = async (req, res) => {
    try {
      const sessions = await AuthSession.findAll({
        where: { userId: req.user.id, isActive: true },
        attributes: ['id', 'ipAddress', 'browser', 'device', 'operatingSystem', 'lastActivity', 'createdAt']
      });
      return successResponse(res, 'Active sessions retrieved', sessions);
    } catch (error) {
      logger.error(`Get sessions error: ${error.message}`);
      return errorResponse(res, 'Failed to get sessions', [], 400);
    }
  }

  logoutAll = async (req, res) => {
    try {
      await AuthSession.update({ isActive: false }, { where: { userId: req.user.id } });
      await AuditLog.create({
        userId: req.user.id, action: 'LOGOUT_ALL', entity: 'User', entityId: req.user.id, ipAddress: req.ip
      });
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return successResponse(res, 'Logged out from all devices');
    } catch (error) {
      logger.error(`Logout all error: ${error.message}`);
      return errorResponse(res, 'Failed to logout from all devices', [], 400);
    }
  }

  logoutDevice = async (req, res) => {
    try {
      const sessionId = req.params.id;
      await AuthSession.update({ isActive: false }, { where: { id: sessionId, userId: req.user.id } });
      await AuditLog.create({
        userId: req.user.id, action: 'LOGOUT_DEVICE', entity: 'AuthSession', entityId: sessionId, ipAddress: req.ip
      });
      return successResponse(res, 'Logged out from device');
    } catch (error) {
      logger.error(`Logout device error: ${error.message}`);
      return errorResponse(res, 'Failed to logout from device', [], 400);
    }
  }

  getAll = async (req, res) => {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  getById = async (req, res) => {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  create = async (req, res) => {
    return res.status(201).json({ success: true, message: 'Not Implemented' });
  }
  update = async (req, res) => {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  delete = async (req, res) => {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }

}
module.exports = new AuthController();
