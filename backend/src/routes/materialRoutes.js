const express = require('express');
const {
    uploadMaterial,
    getMaterials,
    getMyMaterials
} = require('../controllers/materialController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Teacher', 'Admin'), upload.single('file'), uploadMaterial);
router.get('/my', protect, authorize('Teacher', 'Admin'), getMyMaterials);
router.get('/class/:classId', protect, getMaterials);

module.exports = router;
