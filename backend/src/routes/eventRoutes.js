const express = require('express');
const { getEvents, createEvent, deleteEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getEvents);
router.post('/', protect, authorize('Admin'), createEvent);
router.delete('/:id', protect, authorize('Admin'), deleteEvent);

module.exports = router;
