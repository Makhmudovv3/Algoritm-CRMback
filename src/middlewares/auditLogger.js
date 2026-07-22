
const { AuditLog } = require('../models');
module.exports = async (req, res, next) => {
  const oldSend = res.send;
  res.send = function(data) {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      AuditLog.create({
        userId: req.user?.id,
        action: req.method,
        module: req.baseUrl,
        ip: req.ip,
        device: req.headers['user-agent']
      }).catch(console.error);
    }
    oldSend.apply(res, arguments);
  };
  next();
};
