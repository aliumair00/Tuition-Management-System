// PDF Service for generating invoice PDFs using PDFKit
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

/**
 * Generate a PDF for a given invoice and save it locally.
 * The PDF is saved to the `uploads/` directory and the invoice document is updated with the file URL.
 * @param {string} invoiceId - MongoDB ObjectId of the invoice
 */
async function generateInvoicePDF(invoiceId) {
    const invoice = await Invoice.findById(invoiceId).populate('studentId', 'name email');
    if (!invoice) {
        throw new Error('Invoice not found');
    }

    // Ensure uploads directory exists
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const pdfPath = path.join(uploadsDir, `invoice_${invoice._id}.pdf`);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Simple invoice layout
    doc.fontSize(20).text('Tuition Institute Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice ID: ${invoice._id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Student: ${invoice.studentId.name} (${invoice.studentId.email})`);
    doc.text(`Amount Due: $${invoice.amount.toFixed(2)}`);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
    doc.moveDown();
    doc.text('Thank you for your payment.', { align: 'center' });

    doc.end();

    // Wait for the file to finish writing
    await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });

    // Update invoice with PDF URL (using a relative path for simplicity)
    const pdfUrl = `/uploads/${path.basename(pdfPath)}`;
    invoice.pdfUrl = pdfUrl;
    await invoice.save();
}

module.exports = { generateInvoicePDF };
