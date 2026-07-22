const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/SettingsController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, settingsController.getSettings);
router.get('/:id', verifyToken, settingsController.getById);
router.post('/', verifyToken, verifyRole(['SUPER_ADMIN']), settingsController.create);
router.put('/:key', verifyToken, verifyRole(['SUPER_ADMIN']), settingsController.updateSetting);
router.delete('/:id', verifyToken, verifyRole(['SUPER_ADMIN']), settingsController.delete);

module.exports = router;
