const express = require('express');
const {
    getMyChildren,
    getDashboardStats,
    getChildrenInvoices,
    getChildDetails
} = require('../controllers/parentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes are protected and only accessible by parents
router.use(protect);
router.use(authorize('Parent'));

router.get('/children', getMyChildren);
router.get('/children/:childId', getChildDetails);
router.get('/dashboard-stats', getDashboardStats);
router.get('/invoices', getChildrenInvoices);

module.exports = router;
