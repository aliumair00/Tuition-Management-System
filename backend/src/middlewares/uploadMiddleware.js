const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        // Simple mime type check if needed, or rely on cloudinary allowed_formats
        if (file.mimetype.startsWith('image/') ||
            file.mimetype === 'application/pdf' ||
            file.mimetype.includes('wordprocessing') ||
            file.mimetype.includes('msword') ||
            file.mimetype === 'text/plain') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type! Only images and documents are allowed.'), false);
        }
    }
});

module.exports = upload;
