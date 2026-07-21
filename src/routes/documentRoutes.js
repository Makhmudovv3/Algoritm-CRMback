const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.use(verifyToken);

router.get('/', documentController.getAll);
router.get('/:id', documentController.getById);
// Replace create to accept single file upload 'file'
router.post('/', upload.single('file'), documentController.create);
router.put('/:id', upload.single('file'), documentController.update);
router.delete('/:id', documentController.delete);

module.exports = router;
