const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmailNotification } = require('../services/emailService');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const normalizeRole = (r) => ({
            student: 'Student',
            teacher: 'Teacher',
            parent: 'Parent',
            admin: 'Admin'
        }[String(r || 'Student').toLowerCase()] || 'Student');

        // Create user
        // Note: For production, you might want to restrict role creation (e.g., only Admin can create Admin/Teacher)
        const user = await User.create({
            name,
            email,
            password,
            role: normalizeRole(role)
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: { message: 'Please provide an email and password' } });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
        }

        if (!user.active) {
            return res.status(401).json({ success: false, error: { message: 'User is inactive' } });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        // .cookie('token', token, options) // Optional: If using cookies
        .json({
            success: true,
            accessToken: token,
            refreshToken: refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                classId: user.classId
            }
        });
};

// @desc    Forgot password
// @route   POST /api/auth/forgot
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: { message: 'No user with that email' } });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL (frontend will handle)
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: ${resetUrl}`;

        try {
            await sendEmailNotification(user._id, 'Password Reset Request', message);
            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            // Clean up token fields
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, error: { message: 'Email could not be sent' } });
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const { resetToken } = req.params;
        const { password } = req.body;

        // Hash token
        const crypto = require('crypto');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Find user by token and ensure token not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, error: { message: 'Invalid or expired token' } });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

