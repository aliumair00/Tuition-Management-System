// Invoice controller
const Invoice = require('../models/Invoice');
const asyncHandler = require('express-async-handler');
const pdfService = require('../services/pdfService');

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Teacher/Admin
exports.createInvoice = asyncHandler(async (req, res) => {
    const invoice = await Invoice.create(req.body);
    // Optionally generate PDF after creation (async fire-and-forget)
    if (invoice) {
        pdfService.generateInvoicePDF(invoice._id).catch(err => console.error('PDF generation error', err));
    }
    res.status(201).json({ success: true, data: invoice });
});

// @desc    Get invoices for logged-in user
// @route   GET /api/invoices/my
// @access  Private (Student)
exports.getMyInvoices = asyncHandler(async (req, res) => {
    const invoices = await Invoice.find({ studentId: req.user.id })
        .populate('classId', 'name')
        .populate('studentId', 'name email')
        .sort({ dueDate: 1 });
    res.json({ success: true, count: invoices.length, data: invoices });
});

// @desc    Get invoices for a student
// @route   GET /api/invoices/student/:studentId
// @access  Authenticated (Student/Parent/Admin)
exports.getStudentInvoices = asyncHandler(async (req, res) => {
    const invoices = await Invoice.find({ studentId: req.params.studentId })
        .populate('classId', 'name')
        .populate('studentId', 'name email');
    res.json({ success: true, count: invoices.length, data: invoices });
});

// @desc    Mark invoice as paid
// @route   PATCH /api/invoices/:id/pay
// @access  Teacher/Admin
exports.payInvoice = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
        return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    invoice.paid = true;
    invoice.paidAt = new Date();
    await invoice.save();
    res.json({ success: true, data: invoice });
});

// @desc    Get all invoices (Admin)
// @route   GET /api/invoices
// @access  Admin
exports.getInvoices = asyncHandler(async (req, res) => {
    const invoices = await Invoice.find()
        .populate('classId', 'name')
        .populate('studentId', 'name email')
        .sort({ createdAt: -1 });
    res.json({ success: true, count: invoices.length, data: invoices });
});


