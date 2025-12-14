// Analytics routes
const express = require('express');
const { getAdminStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/admin', protect, authorize('Admin'), getAdminStats);
router.get('/teacher', protect, authorize('Teacher'), require('../controllers/analyticsController').getTeacherStats);

module.exports = router;
