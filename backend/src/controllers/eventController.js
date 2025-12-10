const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');

// @desc    Get all events
// @route   GET /api/events
// @access  Public (Authenticated)
exports.getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find().sort({ startDate: 1 });
    res.json({ success: true, count: events.length, data: events });
});

// @desc    Create event
// @route   POST /api/events
// @access  Admin
exports.createEvent = asyncHandler(async (req, res) => {
    req.body.createdBy = req.user.id;
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Admin
exports.deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    await event.deleteOne();
    res.json({ success: true, data: {} });
});


