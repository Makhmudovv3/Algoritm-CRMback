const express = require('express');
const router = express.Router();
const callLogController = require('../controllers/callLogController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
// Example roles, customize as needed
// router.use(authorizeRoles('SUPER_ADMIN', 'DIRECTOR', 'BRANCH_MANAGER'));

router.get('/', callLogController.getAll);
router.get('/:id', callLogController.getById);
router.post('/', callLogController.create);
router.put('/:id', callLogController.update);
router.delete('/:id', callLogController.delete);

module.exports = router;
