const User = require('../models/User');
const Invoice = require('../models/Invoice');
const Notification = require('../models/Notification');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');

// @desc    Get parent's children
// @route   GET /api/parent/children
// @access  Private/Parent
exports.getMyChildren = asyncHandler(async (req, res) => {
    const children = await User.find({
        parentId: req.user.id,
        active: true
    })
        .populate('classId', 'name')
        .select('name email profileImageUrl classId');

    res.json({
        success: true,
        count: children.length,
        data: children
    });
});

// @desc    Get dashboard statistics for parent
// @route   GET /api/parent/dashboard-stats
// @access  Private/Parent
exports.getDashboardStats = asyncHandler(async (req, res) => {
    // Get all children IDs
    const children = await User.find({
        parentId: req.user.id,
        active: true
    }).select('_id');

    const childrenIds = children.map(child => child._id);

    // Get total fees due
    const unpaidInvoices = await Invoice.find({
        studentId: { $in: childrenIds },
        paid: false
    });

    const totalFeesDue = unpaidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

    // Get unread notifications count
    const unreadNotifications = await Notification.countDocuments({
        userId: req.user.id,
        read: false
    });

    // Get upcoming events (next 30 days)
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const upcomingEvents = await Event.countDocuments({
        date: {
            $gte: today,
            $lte: nextMonth
        }
    });

    res.json({
        success: true,
        data: {
            totalFeesDue,
            newMessages: unreadNotifications,
            upcomingEvents
        }
    });
});

// @desc    Get invoices for parent's children
// @route   GET /api/parent/invoices
// @access  Private/Parent
exports.getChildrenInvoices = asyncHandler(async (req, res) => {
    // Get all children IDs
    const children = await User.find({
        parentId: req.user.id,
        active: true
    }).select('_id');

    const childrenIds = children.map(child => child._id);

    // Get invoices
    const invoices = await Invoice.find({
        studentId: { $in: childrenIds }
    })
        .populate('studentId', 'name email')
        .populate('classId', 'name')
        .sort({ dueDate: -1 })
        .limit(10);

    res.json({
        success: true,
        count: invoices.length,
        data: invoices
    });
});

// @desc    Get detailed child information
// @route   GET /api/parent/children/:childId
// @access  Private/Parent
exports.getChildDetails = asyncHandler(async (req, res) => {
    const child = await User.findOne({
        _id: req.params.childId,
        parentId: req.user.id,
        active: true
    })
        .populate('classId', 'name');

    if (!child) {
        return res.status(404).json({
            success: false,
            error: 'Child not found or access denied'
        });
    }

    // Get child's attendance, grades, etc. (if available)
    // For now, return basic info
    res.json({
        success: true,
        data: child
    });
});
