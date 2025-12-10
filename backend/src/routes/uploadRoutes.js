const express = require('express');
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Single file upload endpoint
router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;
