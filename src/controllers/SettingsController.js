const { SystemSetting } = require('../models');
const { successResponse } = require('../utils/response');

class SettingsController {
  async getSettings(req, res, next) {
    try {
      const settings = await SystemSetting.findAll();
      return successResponse(res, 'System settings fetched successfully', settings);
    } catch (error) {
      next(error);
    }
  }

  async updateSetting(req, res, next) {
    try {
      const { key } = req.params;
      const { value, type, category, isPublic } = req.body;
      
      let setting = await SystemSetting.findOne({ where: { key } });
      if (!setting) {
        setting = await SystemSetting.create({ key, value, type, category, isPublic });
      } else {
        await setting.update({ value, type, category, isPublic });
      }

      return successResponse(res, 'Setting updated', setting);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  async getById(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  async create(req, res) {
    return res.status(201).json({ success: true, message: 'Not Implemented' });
  }
  async update(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }
  async delete(req, res) {
    return res.status(200).json({ success: true, message: 'Not Implemented' });
  }

}
module.exports = new SettingsController();
