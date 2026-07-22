const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const logger = require('../utils/logger');
const { User, AuthSession } = require('../models');

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    logger.warn(`[AUTH] Access denied. No token provided for IP: ${req.ip}`);
    return errorResponse(res, 'Access denied. No token provided.', [], 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Hard DB check to enforce immediate revocation if blocked or tokenVersion changed
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return errorResponse(res, 'User not found.', [], 401);
    }
    if (!user.isActive || user.isBlocked) {
      // Revoke all sessions
      await AuthSession.update({ isActive: false }, { where: { userId: user.id } });
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return errorResponse(res, 'Account is inactive or blocked. All sessions revoked.', [], 401);
    }
    if (user.tokenVersion !== decoded.tokenVersion) {
      return errorResponse(res, 'Token version expired. Please login again.', [], 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`[AUTH] Token validation failed. IP: ${req.ip}, Error: ${error.message}`);
    // If access token expired, we still return 401. The frontend should try to refresh.
    return errorResponse(res, 'Invalid token.', [], 401);
  }
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn(`[AUTH] Role verification failed: No user object. IP: ${req.ip}`);
      return errorResponse(res, 'Access denied. Insufficient permissions.', [], 403);
    }
    if (req.user.role === 'SUPER_ADMIN' || roles.includes(req.user.role)) {
      return next();
    }
    logger.warn(`[AUTH] Role access denied for User ID: ${req.user.id}, Role: ${req.user.role}, Attempted access to: ${req.originalUrl}`);
    return errorResponse(res, 'Access denied. Insufficient permissions.', [], 403);
  };
};

module.exports = {
  verifyToken,
  verifyRole
};
