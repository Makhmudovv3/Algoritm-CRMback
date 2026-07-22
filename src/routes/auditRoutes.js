const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
// Example roles, customize as needed
// router.use(authorizeRoles('SUPER_ADMIN', 'DIRECTOR', 'BRANCH_MANAGER'));

router.get('/', auditLogController.getAll);
router.get('/:id', auditLogController.getById);
router.post('/', auditLogController.create);
router.put('/:id', auditLogController.update);
router.delete('/:id', auditLogController.delete);

module.exports = router;
