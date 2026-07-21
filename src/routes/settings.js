const express = require('express');
const router = express.Router();
const systemSettingController = require('../controllers/systemSettingController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// Apply authentication to all settings routes
router.use(verifyToken);

// GET routes available to all authenticated users (or restrict as needed)
router.get('/', systemSettingController.getAll);
router.get('/:category', systemSettingController.getByCategory);

// PUT routes restricted to SUPER_ADMIN only
router.put('/:category', verifyRole(['SUPER_ADMIN']), systemSettingController.updateCategory);

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: System settings management
 */

module.exports = router;
