const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', discountController.getAll);
router.get('/:id', discountController.getById);
router.post('/', discountController.create);
router.put('/:id', discountController.update);
router.delete('/:id', discountController.delete);

module.exports = router;
