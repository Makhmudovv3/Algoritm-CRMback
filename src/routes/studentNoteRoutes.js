const express = require('express');
const router = express.Router();
const studentNoteController = require('../controllers/studentNoteController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
// Example roles, customize as needed
// router.use(authorizeRoles('SUPER_ADMIN', 'DIRECTOR', 'BRANCH_MANAGER'));

router.get('/', studentNoteController.getAll);
router.get('/:id', studentNoteController.getById);
router.post('/', studentNoteController.create);
router.put('/:id', studentNoteController.update);
router.delete('/:id', studentNoteController.delete);

module.exports = router;
