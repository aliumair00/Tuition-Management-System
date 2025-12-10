// Invoice model
const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paid: { type: Boolean, default: false },
    paidAt: { type: Date },
    pdfUrl: { type: String }, // URL to generated PDF (if stored)
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
