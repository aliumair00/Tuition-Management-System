const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    periods: [{
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        startTime: {
            type: String, // Format: "HH:MM"
            required: true
        },
        endTime: {
            type: String, // Format: "HH:MM"
            required: true
        },
        room: String
    }]
}, { timestamps: true });

// Ensure one timetable per class per day
TimetableSchema.index({ classId: 1, dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', TimetableSchema);
