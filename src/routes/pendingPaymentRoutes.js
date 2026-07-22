const express = require('express');
const router = express.Router();
const pendingPaymentController = require('../controllers/pendingPaymentController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
// Example roles, customize as needed
// router.use(authorizeRoles('SUPER_ADMIN', 'DIRECTOR', 'BRANCH_MANAGER'));

router.get('/', pendingPaymentController.getAll);
router.get('/:id', pendingPaymentController.getById);
router.post('/', pendingPaymentController.create);
router.put('/:id', pendingPaymentController.update);
router.delete('/:id', pendingPaymentController.delete);

module.exports = router;
