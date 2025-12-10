// Result controller
const Result = require('../models/Result');
const asyncHandler = require('express-async-handler');

// @desc    Get results for logged-in student
// @route   GET /api/results/my
// @access  Private (Student)
exports.getMyResults = asyncHandler(async (req, res) => {
    const results = await Result.find({ studentId: req.user.id })
        .populate('examId', 'title date subjectId')
        .populate('studentId', 'name email')
        .sort({ createdAt: -1 });
    res.json({ success: true, count: results.length, data: results });
});

// @desc    Get results for a student (Admin/Teacher)
// @route   GET /api/results/student/:studentId
// @access  Authenticated (Student/Parent/Admin)
exports.getStudentResults = asyncHandler(async (req, res) => {
    const results = await Result.find({ studentId: req.params.studentId })
        .populate('examId', 'title date')
        .populate('studentId', 'name email');
    res.json({ success: true, count: results.length, data: results });
});

// @desc    Get result for a specific exam
// @route   GET /api/results/:id
// @access  Authenticated
exports.getResult = asyncHandler(async (req, res) => {
    const result = await Result.findById(req.params.id)
        .populate('examId', 'title')
        .populate('studentId', 'name');
    if (!result) {
        return res.status(404).json({ success: false, error: 'Result not found' });
    }
    res.json({ success: true, data: result });
});

// @desc    Create result (teacher/admin after grading)
// @route   POST /api/results
// @access  Teacher/Admin
exports.createResult = asyncHandler(async (req, res) => {
    const result = await Result.create(req.body);
    res.status(201).json({ success: true, data: result });
});

// @desc    Get all results (filter by examId, studentId)
// @route   GET /api/results
// @access  Authenticated (Teacher/Admin)
exports.getResults = asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.examId) query.examId = req.query.examId;
    if (req.query.studentId) query.studentId = req.query.studentId;

    const results = await Result.find(query)
        .populate('examId', 'title date')
        .populate('studentId', 'name email');

    res.json({ success: true, count: results.length, data: results });
});


