// Analytics routes
const express = require('express');
const { getAdminStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/admin', protect, authorize('Admin'), getAdminStats);

module.exports = router;
