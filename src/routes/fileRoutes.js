const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middlewares/authMiddleware');
const { successResponse } = require('../utils/response');
const fileController = require('../controllers/fileController');

// Configure local storage (In production, replace with AWS S3 SDK)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/upload', verifyToken, upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Fayl yuklanmadi' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return successResponse(res, 'File uploaded', { url: fileUrl, filename: req.file.originalname });
  } catch (error) {
    next(error);
  }
});


// Standard CRUD
router.get('/', fileController.getAll);
router.get('/:id', fileController.getById);
router.post('/', fileController.create);
router.put('/:id', fileController.update);
router.delete('/:id', fileController.delete);

module.exports = router;
