const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { authLimiter } = require('../middlewares/rateLimiter');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', authLimiter, registerValidator, authController.register);
router.post('/login', authLimiter, loginValidator, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.get('/me', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Protected route accessed', data: req.user });
});

// Session Management API
router.get('/sessions', verifyToken, authController.getSessions);
router.post('/sessions/logout-all', verifyToken, authController.logoutAll);
router.delete('/sessions/:id', verifyToken, authController.logoutDevice);


// Standard CRUD
router.get('/', authController.getAll);
router.get('/:id', authController.getById);
router.post('/', authController.create);
router.put('/:id', authController.update);
router.delete('/:id', authController.delete);

module.exports = router;

