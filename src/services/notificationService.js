const BaseService = require('./baseService');
const notificationRepository = require('../repositories/notificationRepository');

class NotificationService extends BaseService {
  constructor() {
    super(notificationRepository, []);
  }

  async createNotification(io, data) {
    const notification = await this.repository.create({
      userId: data.userId,
      title: data.title,
      content: data.content,
      type: data.type || 'system',
      priority: data.priority || 'low',
      category: data.category || 'general'
    });

    if (io) {
      // Emit to a specific user's room
      io.to(data.userId.toString()).emit('new_notification', notification);
    }
    return notification;
  }

  async notifyAdmins(io, data) {
    const { User, Role } = require('../models');
    // Find admins
    const adminRoles = await Role.findAll({ where: { name: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] } });
    if (!adminRoles.length) return;
    const roleIds = adminRoles.map(r => r.id);
    const admins = await User.findAll({ where: { roleId: roleIds } });
    
    for (const admin of admins) {
      await this.createNotification(io, {
        ...data,
        userId: admin.id
      });
    }
  }
}

module.exports = new NotificationService();
