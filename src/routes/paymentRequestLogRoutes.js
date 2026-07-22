const express = require('express');
const router = express.Router();
const paymentRequestLogController = require('../controllers/paymentRequestLogController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
// Example roles, customize as needed
// router.use(authorizeRoles('SUPER_ADMIN', 'DIRECTOR', 'BRANCH_MANAGER'));

router.get('/', paymentRequestLogController.getAll);
router.get('/:id', paymentRequestLogController.getById);
router.post('/', paymentRequestLogController.create);
router.put('/:id', paymentRequestLogController.update);
router.delete('/:id', paymentRequestLogController.delete);

module.exports = router;
