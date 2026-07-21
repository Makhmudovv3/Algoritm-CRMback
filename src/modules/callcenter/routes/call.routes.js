const express = require('express');
const router = express.Router();
const callController = require('../controllers/call.controller');
const { verifyToken, verifyRole } = require('../../../middlewares/authMiddleware');
const { createCallValidator, updateCallValidator } = require('../validators/call.validator');
const ROLES = { SUPER_ADMIN: 'SUPER_ADMIN', DIRECTOR: 'DIRECTOR', BRANCH_MANAGER: 'BRANCH_MANAGER', CALL_CENTER: 'CALL MARKAZ', ADMIN: 'ADMIN', MANAGER: 'MANAGER' };

router.use(verifyToken);
router.use(verifyRole([ROLES.SUPER_ADMIN, ROLES.DIRECTOR, ROLES.BRANCH_MANAGER, ROLES.CALL_CENTER, ROLES.ADMIN, ROLES.MANAGER]));

router.get('/', callController.getAll.bind(callController));
router.get('/:id', callController.getById.bind(callController));
router.post('/', createCallValidator, callController.create.bind(callController));
router.put('/:id', updateCallValidator, callController.update.bind(callController));
router.delete('/:id', callController.delete.bind(callController));

module.exports = router;
