const express = require('express');
const {
    uploadMaterial,
    getMaterials
} = require('../controllers/materialController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Teacher', 'Admin'), upload.single('file'), uploadMaterial);
router.get('/class/:classId', protect, getMaterials);

module.exports = router;
