const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/chat', verifyToken, aiController.chat);

module.exports = router;
