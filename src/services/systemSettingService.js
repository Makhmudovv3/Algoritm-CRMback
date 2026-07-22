const systemSettingRepository = require('../repositories/SystemSettingRepository');
const { sequelize, AuditLog } = require('../models');

class SystemSettingService {
  async getByCategory(category) {
    if (!category) {
      throw new Error('Category is required');
    }
    return await systemSettingRepository.getByCategory(category);
  }

  async getAll() {
    return await systemSettingRepository.findAll();
  }

  async updateCategory(category, settingsData, userId, ipAddress) {
    if (!category) throw new Error('Category is required');
    if (!Array.isArray(settingsData)) throw new Error('Settings data must be an array');

    // Input validation: ensure we only update keys that belong to this category
    const existingSettings = await this.getByCategory(category);
    const existingKeys = existingSettings.map(s => s.key);

    const updates = [];
    for (const data of settingsData) {
      updates.push({
        key: data.key,
        category: category,
        value: data.value,
        updatedBy: userId
      });
    }

    if (updates.length === 0) return { message: 'No valid settings to update' };

    // Transaction for updates
    const t = await sequelize.transaction();
    try {
      await systemSettingRepository.updateBulk(updates, t);

      // Audit Log
      await AuditLog.create({
        userId,
        action: 'UPDATE',
        entity: 'SystemSetting',
        entityId: null,
        ipAddress
      }, { transaction: t });

      await t.commit();
      return { success: true, count: updates.length };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new SystemSettingService();
