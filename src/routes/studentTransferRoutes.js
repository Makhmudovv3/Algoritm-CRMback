const express = require('express');
const router = express.Router();
const studentTransferController = require('../controllers/studentTransferController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', studentTransferController.getAll);
router.get('/:id', studentTransferController.getById);
router.post('/', studentTransferController.create);
router.put('/:id', studentTransferController.update);
router.delete('/:id', studentTransferController.delete);

module.exports = router;
