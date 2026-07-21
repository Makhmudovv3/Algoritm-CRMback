const express = require('express');
const router = express.Router();
const followUpController = require('../controllers/followUp.controller');
const { verifyToken, verifyRole } = require('../../../middlewares/authMiddleware');
const { createFollowUpValidator } = require('../validators/call.validator');
const ROLES = { SUPER_ADMIN: 'SUPER_ADMIN', DIRECTOR: 'DIRECTOR', BRANCH_MANAGER: 'BRANCH_MANAGER', CALL_CENTER: 'CALL MARKAZ', ADMIN: 'ADMIN', MANAGER: 'MANAGER' };

router.use(verifyToken);
router.use(verifyRole([ROLES.SUPER_ADMIN, ROLES.DIRECTOR, ROLES.BRANCH_MANAGER, ROLES.CALL_CENTER, ROLES.ADMIN, ROLES.MANAGER]));

router.get('/', followUpController.getAll.bind(followUpController));
router.post('/', createFollowUpValidator, followUpController.create.bind(followUpController));
router.put('/:id', followUpController.update.bind(followUpController));
router.delete('/:id', followUpController.delete.bind(followUpController));

module.exports = router;
