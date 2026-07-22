const express = require('express');
const router = express.Router();
const dailyClosingController = require('../controllers/dailyClosingController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
// Example roles, customize as needed
// router.use(authorizeRoles('SUPER_ADMIN', 'DIRECTOR', 'BRANCH_MANAGER'));

router.get('/', dailyClosingController.getAll);
router.get('/:id', dailyClosingController.getById);
router.post('/', dailyClosingController.create);
router.put('/:id', dailyClosingController.update);
router.delete('/:id', dailyClosingController.delete);

module.exports = router;
