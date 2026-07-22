const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reports/ReportController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/general', verifyToken, reportController.getGeneralReport);
router.get('/attendance', verifyToken, reportController.getAttendanceReport);


// Standard CRUD
router.get('/', reportController.getAll);
router.get('/:id', reportController.getById);
router.post('/', reportController.create);
router.put('/:id', reportController.update);
router.delete('/:id', reportController.delete);

module.exports = router;
