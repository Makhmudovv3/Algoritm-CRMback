const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Use Cloudinary Storage if configured, or memory storage as fallback
let storage;
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'algoritm-crm',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf', 'doc', 'docx', 'mp4', 'mp3'],
      resource_type: 'auto',
    },
  });
} else {
  // Memory storage ensures zero permanent local disk usage on Railway
  storage = multer.memoryStorage();
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4', 'audio/mpeg'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WEBP, PDF, DOC, MP4, and MP3 are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max upload
  },
  fileFilter: fileFilter
});

module.exports = { upload };
