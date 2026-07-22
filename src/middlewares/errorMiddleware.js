const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  logger.error(`[Global Error] ${err.message}`, { 
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user ? req.user.id : 'unauthenticated'
  });

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  return require('../utils/response').errorResponse(res, message, [err.message], statusCode);
};

module.exports = errorMiddleware;
