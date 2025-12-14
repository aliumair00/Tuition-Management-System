const LeaveRequest = require('../models/LeaveRequest');
const asyncHandler = require('express-async-handler');

// @desc    Create a leave request
// @route   POST /api/leaves
// @access  Private (Student/Parent/Teacher)
const createLeave = asyncHandler(async (req, res) => {
    const { type, startDate, endDate, reason } = req.body;
    const leave = await LeaveRequest.create({
        requestedBy: req.user.id,
        type,
        startDate,
        endDate,
        reason
    });
    res.status(201).json({ success: true, data: leave });
});

// @desc    Get pending leave requests
// @route   GET /api/leaves/pending
// @access  Private (Admin)
const getPendingLeaves = asyncHandler(async (req, res) => {
    const leaves = await LeaveRequest.find({ status: 'Pending' })
        .populate('requestedBy', 'name email role')
        .sort({ createdAt: -1 });
    res.json({ success: true, count: leaves.length, data: leaves });
});

// @desc    Approve a leave request
// @route   PATCH /api/leaves/:id/approve
// @access  Private (Admin)
const approveLeave = asyncHandler(async (req, res) => {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, error: 'Leave request not found' });
    leave.status = 'Approved';
    leave.approvedBy = req.user.id;
    await leave.save();
    res.json({ success: true, data: leave });
});

// @desc    Reject a leave request
// @route   PATCH /api/leaves/:id/reject
// @access  Private (Admin)
const rejectLeave = asyncHandler(async (req, res) => {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, error: 'Leave request not found' });
    leave.status = 'Rejected';
    leave.approvedBy = req.user.id;
    await leave.save();
    res.json({ success: true, data: leave });
});

// @desc    Get my leave requests
// @route   GET /api/leaves/my
// @access  Private
const getMyLeaves = asyncHandler(async (req, res) => {
    const leaves = await LeaveRequest.find({ requestedBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: leaves.length, data: leaves });
});

module.exports = { createLeave, getPendingLeaves, approveLeave, rejectLeave, getMyLeaves };
