const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return errorResponse(res, 'Access denied. No token provided.', [], 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token validation failed for token:', token, 'Error:', error.message);
    return errorResponse(res, 'Invalid token.', [], 401);
  }
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Access denied. Insufficient permissions.', [], 403);
    }
    if (req.user.role === 'SUPER_ADMIN' || roles.includes(req.user.role)) {
      return next();
    }
    return errorResponse(res, 'Access denied. Insufficient permissions.', [], 403);
  };
};

module.exports = {
  verifyToken,
  verifyRole
};
