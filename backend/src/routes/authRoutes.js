const express = require('express');
const { login, register, getMe, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.put('/reset/:resetToken', resetPassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/me', protect, getMe);


module.exports = router;
