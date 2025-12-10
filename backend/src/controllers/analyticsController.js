// Analytics controller
const User = require('../models/User');
const Class = require('../models/Class');
const Invoice = require('../models/Invoice');
const Attendance = require('../models/Attendance');
const asyncHandler = require('express-async-handler');

// @desc    Get admin dashboard stats
// @route   GET /api/analytics/admin
// @access  Admin
exports.getAdminStats = asyncHandler(async (req, res) => {
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const totalTeachers = await User.countDocuments({ role: 'Teacher' });
    const totalClasses = await Class.countDocuments();

    // Calculate total revenue (paid invoices)
    const paidInvoices = await Invoice.find({ paid: true });
    const totalRevenue = paidInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);

    // Calculate pending revenue
    const pendingInvoices = await Invoice.find({ paid: false });
    const pendingRevenue = pendingInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);

    // Get today's attendance summary (crude approximation for demo)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendanceRecords = await Attendance.find({ date: { $gte: today } });

    // Basic categorization
    let presentCount = 0;
    let absentCount = 0;

    attendanceRecords.forEach(record => {
        record.records.forEach(entry => {
            if (entry.status === 'Present') presentCount++;
            else absentCount++;
        });
    });

    res.json({
        success: true,
        data: {
            totalStudents,
            totalTeachers,
            totalClasses,
            totalRevenue,
            pendingRevenue,
            attendanceToday: {
                present: presentCount,
                absent: absentCount
            }
        }
    });
});
