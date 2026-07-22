const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken); // All task routes require authentication

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.patch('/:id/toggle', taskController.toggleTask);
router.delete('/:id', taskController.delete);

module.exports = router;
