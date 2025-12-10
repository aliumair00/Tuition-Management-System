const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a class name'],
        trim: true,
        unique: true
    },
    grade: {
        type: String,
        required: [true, 'Please add a grade']
    },
    section: {
        type: String,
        required: [true, 'Please add a section']
    },
    teacherIds: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    subjectIds: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Subject'
    }],
    // We can dynamically populate students via virtuals or keep an array if preferred, 
    // but usually query by classId in Student model is better for scalability.
    // Requirement mentions "student list", we can do reverse populate.
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with virtuals
ClassSchema.virtual('students', {
    ref: 'User',
    localField: '_id',
    foreignField: 'classId',
    justOne: false
});

module.exports = mongoose.model('Class', ClassSchema);
