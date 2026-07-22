const express = require('express');
const router = express.Router();
const studentGroupController = require('../controllers/studentGroupController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
// Example roles, customize as needed
// router.use(authorizeRoles('SUPER_ADMIN', 'DIRECTOR', 'BRANCH_MANAGER'));

router.get('/', studentGroupController.getAll);
router.get('/:id', studentGroupController.getById);
router.post('/', studentGroupController.create);
router.put('/:id', studentGroupController.update);
router.delete('/:id', studentGroupController.delete);

module.exports = router;
