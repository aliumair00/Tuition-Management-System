// Exam routes
const express = require('express');
const { createExam, getExams, getExam, submitExam, gradeExam } = require('../controllers/examController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Teacher', 'Admin'), createExam);
router.get('/', protect, getExams);
router.get('/:id', protect, getExam);
router.post('/:id/submit', protect, authorize('Student'), submitExam);
router.post('/:id/grade', protect, authorize('Teacher', 'Admin'), gradeExam);

module.exports = router;
