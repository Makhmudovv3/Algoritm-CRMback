const express = require('express');
const router = express.Router();
const paymentRequestController = require('../controllers/paymentRequestController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
// Example roles, customize as needed
// router.use(authorizeRoles('SUPER_ADMIN', 'DIRECTOR', 'BRANCH_MANAGER'));

router.get('/', paymentRequestController.getAll);
router.get('/:id', paymentRequestController.getById);
router.post('/', paymentRequestController.create);
router.put('/:id', paymentRequestController.update);
router.delete('/:id', paymentRequestController.delete);

module.exports = router;
