const express = require('express');
const {
    getClasses,
    getClass,
    createClass,
    updateClass,
    deleteClass
} = require('../controllers/classController');

const Class = require('../models/Class');
const advancedResults = require('../middlewares/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

router
    .route('/')
    .get(advancedResults(Class, { path: 'teacherIds subjectIds students', select: 'name code email' }), getClasses)
    .post(protect, authorize('Admin'), createClass);

router.get('/my', protect, authorize('Teacher'), require('../controllers/classController').getMyClasses);

router
    .route('/:id')
    .get(protect, getClass)
    .put(protect, authorize('Admin'), updateClass)
    .delete(protect, authorize('Admin'), deleteClass);

module.exports = router;
