// Analytics controller
const User = require('../models/User');
const Class = require('../models/Class');
const Invoice = require('../models/Invoice');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Timetable = require('../models/Timetable');
const asyncHandler = require('express-async-handler');

// @desc    Get admin dashboard stats
// @route   GET /api/analytics/admin
// @access  Admin
const getAdminStats = asyncHandler(async (req, res) => {
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

// @desc    Get teacher dashboard stats
// @route   GET /api/analytics/teacher
// @access  Teacher
const getTeacherStats = asyncHandler(async (req, res) => {
    const teacherId = req.user.id;

    // 1. Get My Classes
    const classes = await Class.find({ teacherIds: teacherId });
    const classIds = classes.map(c => c._id);

    // 2. Count Total Students (Approximation based on simple sum, or distinct if needed)
    // Since Class model uses virtuals for students, we might need a separate query or aggregation if we want precise unique students.
    // For dashboard summary, let's just count total enrollments across their classes.
    // We can use the User model to find students who have classId in our list.
    const totalStudents = await User.countDocuments({
        role: 'Student',
        classId: { $in: classIds }
    });

    // 3. Upcoming Exams
    const upcomingExams = await Exam.find({
        classId: { $in: classIds },
        date: { $gte: new Date() }
    })
        .sort({ date: 1 })
        .limit(5)
        .populate('classId', 'name grade section')
        .populate('subjectId', 'name');

    // 4. Today's Timetable
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    const timetables = await Timetable.find({
        dayOfWeek: today,
        'periods.teacherId': teacherId
    })
        .populate('classId', 'name')
        .populate('periods.subjectId', 'name');

    // Extract and sort relevant periods
    let todaysPeriods = [];
    timetables.forEach(tt => {
        tt.periods.forEach(p => {
            if (p.teacherId.toString() === teacherId.toString()) {
                todaysPeriods.push({
                    _id: p._id,
                    className: tt.classId.name,
                    subject: p.subjectId.name,
                    startTime: p.startTime,
                    endTime: p.endTime,
                    room: p.room,
                    type: 'class'
                });
            }
        });
    });

    // Sort by start time
    todaysPeriods.sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.json({
        success: true,
        data: {
            totalClasses: classes.length,
            totalStudents,
            upcomingExams,
            todaysTimetable: todaysPeriods
        }
    });
});

module.exports = { getAdminStats, getTeacherStats };
