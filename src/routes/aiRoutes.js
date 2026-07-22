const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai/AiController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/dashboard-summary', verifyToken, aiController.getDashboardSummary);
router.get('/finance-analysis', verifyToken, aiController.analyzeFinance);
router.get('/drop-risk', verifyToken, aiController.predictStudentDropRisk);


// Standard CRUD
router.get('/', aiController.getAll);
router.get('/:id', aiController.getById);
router.post('/', aiController.create);
router.put('/:id', aiController.update);
router.delete('/:id', aiController.delete);

module.exports = router;
