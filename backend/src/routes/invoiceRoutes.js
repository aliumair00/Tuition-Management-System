// Invoice routes
const express = require('express');
const { createInvoice, getStudentInvoices, payInvoice } = require('../controllers/invoiceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Teacher', 'Admin'), createInvoice);
router.get('/', protect, authorize('Admin'), require('../controllers/invoiceController').getInvoices);
router.get('/my', protect, authorize('Student'), require('../controllers/invoiceController').getMyInvoices);
router.get('/student/:studentId', protect, authorize('Student', 'Parent', 'Admin'), getStudentInvoices);
router.patch('/:id/pay', protect, authorize('Teacher', 'Admin'), payInvoice);

module.exports = router;
