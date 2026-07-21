const systemSettingService = require('../services/systemSettingService');
const { successResponse, errorResponse } = require('../utils/response');

class SystemSettingController {
  /**
   * @swagger
   * /settings/{category}:
   *   get:
   *     summary: Get settings by category
   *     tags: [Settings]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Returns settings array
   */
  async getByCategory(req, res) {
    try {
      const { category } = req.params;
      const settings = await systemSettingService.getByCategory(category);
      successResponse(res, 'Settings retrieved successfully', settings);
    } catch (error) {
      errorResponse(res, error.message, [], 400);
    }
  }

  /**
   * @swagger
   * /settings:
   *   get:
   *     summary: Get all settings
   *     tags: [Settings]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Returns all settings
   */
  async getAll(req, res) {
    try {
      const settings = await systemSettingService.getAll();
      successResponse(res, 'All settings retrieved successfully', settings);
    } catch (error) {
      errorResponse(res, error.message, [], 400);
    }
  }

  /**
   * @swagger
   * /settings/{category}:
   *   put:
   *     summary: Bulk update settings for a category
   *     tags: [Settings]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               settings:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     key:
   *                       type: string
   *                     value:
   *                       type: string
   *     responses:
   *       200:
   *         description: Settings updated successfully
   */
  async updateCategory(req, res) {
    try {
      const { category } = req.params;
      const { settings } = req.body;
      const userId = req.user.id;
      const ipAddress = req.ip || req.connection.remoteAddress;

      const result = await systemSettingService.updateCategory(category, settings, userId, ipAddress);
      successResponse(res, 'Settings updated successfully', result);
    } catch (error) {
      errorResponse(res, error.message, [], 400);
    }
  }
}

module.exports = new SystemSettingController();
