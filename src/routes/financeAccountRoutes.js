const express = require('express');
const router = express.Router();
const financeAccountController = require('../controllers/financeAccountController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
// Example roles, customize as needed
// router.use(authorizeRoles('SUPER_ADMIN', 'DIRECTOR', 'BRANCH_MANAGER'));

router.get('/', financeAccountController.getAll);
router.get('/:id', financeAccountController.getById);
router.post('/', financeAccountController.create);
router.put('/:id', financeAccountController.update);
router.delete('/:id', financeAccountController.delete);

module.exports = router;
