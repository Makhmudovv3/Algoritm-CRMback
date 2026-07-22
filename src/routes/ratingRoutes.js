const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
// Example roles, customize as needed
// router.use(authorizeRoles('SUPER_ADMIN', 'DIRECTOR', 'BRANCH_MANAGER'));

router.get('/', ratingController.getAll);
router.get('/:id', ratingController.getById);
router.post('/', ratingController.create);
router.put('/:id', ratingController.update);
router.delete('/:id', ratingController.delete);

module.exports = router;
