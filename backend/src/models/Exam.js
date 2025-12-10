// Exam model
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    type: { type: String, enum: ['mcq', 'short', 'essay'], required: true },
    text: { type: String, required: true },
    options: [{ type: String }], // for MCQ
    correctOptionIndex: { type: Number }, // for MCQ
    marks: { type: Number, required: true }
});

const ExamSchema = new mongoose.Schema({
    title: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // minutes
    type: { type: String, enum: ['online', 'offline'], default: 'online' },
    questions: [QuestionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Exam', ExamSchema);
