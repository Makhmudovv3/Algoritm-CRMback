const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.use(verifyToken);

router.get('/', certificateController.getAll);
router.get('/:id', certificateController.getById);
router.post('/', upload.single('file'), certificateController.create);
router.put('/:id', upload.single('file'), certificateController.update);
router.delete('/:id', certificateController.delete);

module.exports = router;
