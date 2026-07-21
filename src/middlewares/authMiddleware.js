const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    logger.warn(`[AUTH] Access denied. No token provided for IP: ${req.ip}`);
    return errorResponse(res, 'Access denied. No token provided.', [], 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`[AUTH] Token validation failed. IP: ${req.ip}, Error: ${error.message}`);
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
