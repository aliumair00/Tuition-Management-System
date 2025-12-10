const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a subject name'],
        trim: true
    },
    code: {
        type: String,
        unique: true,
        required: [true, 'Please add a subject code']
    },
    assignedTeacherId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);
