const express = require('express');
const {
    getSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject
} = require('../controllers/subjectController');

const Subject = require('../models/Subject');
const advancedResults = require('../middlewares/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

router
    .route('/')
    .get(advancedResults(Subject, { path: 'assignedTeacherId', select: 'name email' }), getSubjects)
    .post(protect, authorize('Admin'), createSubject);

router
    .route('/:id')
    .get(protect, getSubject)
    .put(protect, authorize('Admin'), updateSubject)
    .delete(protect, authorize('Admin'), deleteSubject);

module.exports = router;
