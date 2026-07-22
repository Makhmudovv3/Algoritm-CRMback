const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, dashboardController.getDashboard);


// Standard CRUD
router.get('/', dashboardController.getAll);
router.get('/:id', dashboardController.getById);
router.post('/', dashboardController.create);
router.put('/:id', dashboardController.update);
router.delete('/:id', dashboardController.delete);

module.exports = router;
