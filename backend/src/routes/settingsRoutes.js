const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('Admin'), getSettings);
router.put('/', protect, authorize('Admin'), updateSettings);

module.exports = router;
