const express = require('express');
const router = express.Router();
const agentStatusController = require('../controllers/agentStatus.controller');
const { verifyToken, verifyRole } = require('../../../middlewares/authMiddleware');
const { updateAgentStatusValidator } = require('../validators/call.validator');
const ROLES = { SUPER_ADMIN: 'SUPER_ADMIN', DIRECTOR: 'DIRECTOR', BRANCH_MANAGER: 'BRANCH_MANAGER', CALL_CENTER: 'CALL MARKAZ', ADMIN: 'ADMIN', MANAGER: 'MANAGER' };

router.use(verifyToken);
router.use(verifyRole([ROLES.SUPER_ADMIN, ROLES.DIRECTOR, ROLES.BRANCH_MANAGER, ROLES.CALL_CENTER, ROLES.ADMIN, ROLES.MANAGER]));

router.get('/', agentStatusController.getAll.bind(agentStatusController));
router.post('/', updateAgentStatusValidator, agentStatusController.create.bind(agentStatusController));
router.put('/:id', updateAgentStatusValidator, agentStatusController.update.bind(agentStatusController));

module.exports = router;
