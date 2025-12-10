// Result model
const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    marks: { type: Number, required: true },
    details: [{
        questionId: { type: mongoose.Schema.Types.ObjectId },
        obtainedMarks: { type: Number }
    }],
    grade: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);
