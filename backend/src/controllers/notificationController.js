// Notification controller
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');
const emailService = require('../services/emailService');

// @desc    Create a notification (e.g., send email/SMS or in-app)
// @route   POST /api/notifications
// @access  Teacher/Admin
exports.createNotification = asyncHandler(async (req, res) => {
    const { userId, type, title, message } = req.body;
    const notification = await Notification.create({ userId, type, title, message });
    // If email type, trigger email service (fire-and-forget)
    if (type === 'email') {
        emailService.sendEmailNotification(userId, title, message).catch(err => console.error('Email send error', err));
    }
    res.status(201).json({ success: true, data: notification });
});

// @desc    Get notifications for a user
// @route   GET /api/notifications/user/:userId
// @access  Authenticated
exports.getUserNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: notifications.length, data: notifications });
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Authenticated
exports.markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
        return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    notification.read = true;
    await notification.save();
    res.json({ success: true, data: notification });
});
