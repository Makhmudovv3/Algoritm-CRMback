const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');

const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/refresh', authController.refresh);
router.get('/me', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Protected route accessed', data: req.user });
});

module.exports = router;
