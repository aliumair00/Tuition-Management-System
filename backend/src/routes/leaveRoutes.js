const express = require('express');
const { createLeave, getPendingLeaves, approveLeave, rejectLeave, getMyLeaves } = require('../controllers/leaveController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Student', 'Parent', 'Teacher'), createLeave);
router.get('/pending', protect, authorize('Admin'), getPendingLeaves);
router.get('/my', protect, getMyLeaves);
router.patch('/:id/approve', protect, authorize('Admin'), approveLeave);
router.patch('/:id/reject', protect, authorize('Admin'), rejectLeave);

module.exports = router;
