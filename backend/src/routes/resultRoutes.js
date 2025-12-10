// Result routes
const express = require('express');
const { getStudentResults, getResult, createResult } = require('../controllers/resultController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/my', protect, authorize('Student'), require('../controllers/resultController').getMyResults);
router.get('/student/:studentId', protect, authorize('Student', 'Parent', 'Admin'), getStudentResults);
router.get('/:id', protect, getResult);
router.post('/', protect, authorize('Teacher', 'Admin'), createResult);
router.get('/', protect, authorize('Teacher', 'Admin'), require('../controllers/resultController').getResults);

module.exports = router;
