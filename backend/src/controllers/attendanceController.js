const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const asyncHandler = require('express-async-handler');

// @desc    Mark attendance for a class
// @route   POST /api/attendance
// @access  Private (Teacher/Admin)
exports.markAttendance = asyncHandler(async (req, res) => {
    const { classId, date, records } = req.body;

    // Check if class exists
    const classObj = await Class.findById(classId);
    if (!classObj) {
        res.status(404);
        throw new Error('Class not found');
    }

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({ classId, date });
    if (existingAttendance) {
        // Update existing
        existingAttendance.records = records;
        existingAttendance.takenBy = req.user.id;
        await existingAttendance.save();
        return res.status(200).json({ success: true, data: existingAttendance });
    }

    const attendance = await Attendance.create({
        classId,
        date,
        records,
        takenBy: req.user.id
    });

    res.status(201).json({ success: true, data: attendance });
});

// @desc    Get attendance for a class (Teacher/Admin)
// @route   GET /api/attendance/class/:classId
// @access  Private
exports.getClassAttendance = asyncHandler(async (req, res) => {
    const { date } = req.query;
    let query = { classId: req.params.classId };

    if (date) {
        query.date = date;
    }

    const attendance = await Attendance.find(query)
        .populate('records.studentId', 'name email')
        .sort({ date: -1 });

    res.status(200).json({ success: true, data: attendance });
});

// @desc    Get attendance for a logged-in student
// @route   GET /api/attendance/my
// @access  Private (Student)
exports.getMyAttendance = asyncHandler(async (req, res) => {
    // Find all attendance records where the student is listed in records
    const attendance = await Attendance.find({
        'records.studentId': req.user.id
    }).populate('classId', 'name time').sort({ date: -1 });

    // Transform to show only student's status
    const myAttendance = attendance.map(record => {
        const myRecord = record.records.find(r => r.studentId.toString() === req.user.id);
        return {
            _id: record._id,
            date: record.date,
            class: record.classId,
            status: myRecord ? myRecord.status : 'N/A',
            note: myRecord ? myRecord.note : ''
        };
    });

    res.status(200).json({ success: true, data: myAttendance });
});
