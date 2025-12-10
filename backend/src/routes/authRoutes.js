const express = require('express');
const { login, register, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.put('/reset/:resetToken', resetPassword);


module.exports = router;
