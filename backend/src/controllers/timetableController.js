const Timetable = require('../models/Timetable');
const Class = require('../models/Class');
const asyncHandler = require('express-async-handler');

// @desc    Create/Update timetable for a class and day
// @route   POST /api/timetables
// @access  Private (Admin)
exports.updateTimetable = asyncHandler(async (req, res) => {
    const { classId, dayOfWeek, periods } = req.body;

    let timetable = await Timetable.findOne({ classId, dayOfWeek });

    if (timetable) {
        timetable.periods = periods;
        await timetable.save();
    } else {
        timetable = await Timetable.create({
            classId,
            dayOfWeek,
            periods
        });
    }

    res.status(200).json({ success: true, data: timetable });
});

// @desc    Get timetable for a class
// @route   GET /api/timetables/class/:classId
// @access  Public
exports.getClassTimetable = asyncHandler(async (req, res) => {
    const timetable = await Timetable.find({ classId: req.params.classId })
        .populate('periods.subjectId', 'name')
        .populate('periods.teacherId', 'name');

    res.status(200).json({ success: true, data: timetable });
});

// @desc    Get timetable for logged-in teacher
// @route   GET /api/timetables/my (Teacher)
// @access  Private
exports.getMyTimetable = asyncHandler(async (req, res) => {
    // Find timetables where teacher is in periods
    const timetables = await Timetable.find({
        'periods.teacherId': req.user.id
    })
        .populate('classId', 'name')
        .populate('periods.subjectId', 'name')
        .populate('periods.teacherId', 'name');

    // Filter to just relevant details
    // This is complex because a teacher might be in multiple periods across multiple days/classes
    res.status(200).json({ success: true, data: timetables });
});
