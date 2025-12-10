const express = require('express');
const {
    updateTimetable,
    getClassTimetable,
    getMyTimetable
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Admin'), updateTimetable);
router.get('/class/:classId', protect, getClassTimetable);
router.get('/my', protect, authorize('Teacher'), getMyTimetable);

module.exports = router;
