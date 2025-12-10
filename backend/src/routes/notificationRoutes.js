// Notification routes
const express = require('express');
const { createNotification, getUserNotifications, markAsRead } = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Teacher', 'Admin'), createNotification);
router.get('/user/:userId', protect, getUserNotifications);
router.patch('/:id/read', protect, markAsRead);

module.exports = router;
