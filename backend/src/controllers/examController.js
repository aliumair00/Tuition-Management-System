// Exam controller
const Exam = require('../models/Exam');
const asyncHandler = require('express-async-handler');

// @desc    Create a new exam
// @route   POST /api/exams
// @access  Teacher/Admin
exports.createExam = asyncHandler(async (req, res) => {
    const exam = await Exam.create(req.body);
    res.status(201).json({ success: true, data: exam });
});

// @desc    Get all exams (filter by class, subject, date)
// @route   GET /api/exams
// @access  Authenticated
exports.getExams = asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.classId) query.classId = req.query.classId;
    if (req.query.subjectId) query.subjectId = req.query.subjectId;
    if (req.query.date) query.date = new Date(req.query.date);
    const exams = await Exam.find(query);
    res.json({ success: true, count: exams.length, data: exams });
});

// @desc    Get single exam details
// @route   GET /api/exams/:id
// @access  Authenticated
exports.getExam = asyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ success: false, error: 'Exam not found' });
    res.json({ success: true, data: exam });
});

// @desc    Submit exam answers (student)
// @route   POST /api/exams/:id/submit
// @access  Student
exports.submitExam = asyncHandler(async (req, res) => {
    // For simplicity, store answers in a subdocument (could be a separate collection)
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ success: false, error: 'Exam not found' });
    // Here we would calculate scores for MCQ etc. For now just acknowledge.
    res.json({ success: true, message: 'Exam submitted', answers: req.body.answers });
});

// @desc    Grade exam (teacher for subjective questions)
// @route   POST /api/exams/:id/grade
// @access  Teacher/Admin
exports.gradeExam = asyncHandler(async (req, res) => {
    // Placeholder: In real app, update Result collection.
    res.json({ success: true, message: 'Grades saved (placeholder)' });
});


