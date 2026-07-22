const express = require('express');
const router = express.Router();
const systemSettingController = require('../controllers/systemSettingController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, systemSettingController.getAll);
router.get('/:category', verifyToken, systemSettingController.getByCategory);
router.put('/:category', verifyToken, verifyRole(['SUPER_ADMIN']), systemSettingController.updateCategory);

module.exports = router;
