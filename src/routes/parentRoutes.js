const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', parentController.getAll);
router.get('/:id', parentController.getById);
router.post('/', parentController.create);
router.put('/:id', parentController.update);
router.delete('/:id', parentController.delete);

module.exports = router;
