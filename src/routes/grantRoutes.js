const express = require('express');
const router = express.Router();
const grantController = require('../controllers/grantController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', grantController.getAll);
router.get('/:id', grantController.getById);
router.post('/', grantController.create);
router.put('/:id', grantController.update);
router.delete('/:id', grantController.delete);

module.exports = router;
