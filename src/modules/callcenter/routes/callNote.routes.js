const express = require('express');
const router = express.Router();
const callNoteController = require('../controllers/callNote.controller');
const { verifyToken, verifyRole } = require('../../../middlewares/authMiddleware');
const { createCallNoteValidator } = require('../validators/call.validator');
const ROLES = { SUPER_ADMIN: 'SUPER_ADMIN', DIRECTOR: 'DIRECTOR', BRANCH_MANAGER: 'BRANCH_MANAGER', CALL_CENTER: 'CALL MARKAZ', ADMIN: 'ADMIN', MANAGER: 'MANAGER' };

router.use(verifyToken);
router.use(verifyRole([ROLES.SUPER_ADMIN, ROLES.DIRECTOR, ROLES.BRANCH_MANAGER, ROLES.CALL_CENTER, ROLES.ADMIN, ROLES.MANAGER]));

router.get('/', callNoteController.getAll.bind(callNoteController));
router.post('/', createCallNoteValidator, callNoteController.create.bind(callNoteController));
router.put('/:id', callNoteController.update.bind(callNoteController));
router.delete('/:id', callNoteController.delete.bind(callNoteController));

module.exports = router;
