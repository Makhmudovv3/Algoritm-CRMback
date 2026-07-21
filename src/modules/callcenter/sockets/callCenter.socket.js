const logger = require('../../../utils/logger');

const initializeCallCenterSockets = (io) => {
  const callCenterNamespace = io.of('/callcenter');

  callCenterNamespace.on('connection', (socket) => {
    logger.info(`Call Center Agent connected: ${socket.id}`);

    socket.on('agent:status:change', (data) => {
      // data: { userId, status }
      logger.info(`Agent status changed: ${data.userId} -> ${data.status}`);
      // Broadcast to other agents or managers
      callCenterNamespace.emit('agent:status:updated', data);
    });

    socket.on('call:incoming', (data) => {
      logger.info(`Incoming call from ${data.phone}`);
      callCenterNamespace.emit('call:ringing', data);
    });

    socket.on('call:answered', (data) => {
      logger.info(`Call answered by agent ${data.operatorId}`);
      callCenterNamespace.emit('call:active', data);
    });

    socket.on('call:ended', (data) => {
      logger.info(`Call ended: ${data.callId}`);
      callCenterNamespace.emit('call:terminated', data);
    });

    socket.on('disconnect', () => {
      logger.info(`Call Center Agent disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeCallCenterSockets;
