const express = require('express');
const {
    markAttendance,
    getClassAttendance,
    getMyAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Teacher', 'Admin'), markAttendance);
router.get('/class/:classId', protect, authorize('Teacher', 'Admin'), getClassAttendance);
router.get('/my', protect, authorize('Student'), getMyAttendance);

module.exports = router;
