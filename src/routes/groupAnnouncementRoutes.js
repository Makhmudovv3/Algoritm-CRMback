const express = require('express');
const router = express.Router();
const groupAnnouncementController = require('../controllers/groupAnnouncementController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', groupAnnouncementController.getAll);
router.get('/:id', groupAnnouncementController.getById);
router.post('/', groupAnnouncementController.create);
router.put('/:id', groupAnnouncementController.update);
router.delete('/:id', groupAnnouncementController.delete);

module.exports = router;
