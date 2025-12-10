// Email service using Nodemailer
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Configure transporter (using a test SMTP service like Ethereal for demo)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    auth: {
        user: process.env.SMTP_USER || 'your_ethereal_user',
        pass: process.env.SMTP_PASS || 'your_ethereal_pass'
    }
});

/**
 * Send an email notification to a user.
 * @param {string} userId - MongoDB ObjectId of the recipient user.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text body.
 */
async function sendEmailNotification(userId, subject, text) {
    const user = await User.findById(userId);
    if (!user || !user.email) {
        throw new Error('User not found or missing email');
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'no-reply@tuitionapp.com',
        to: user.email,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendEmailNotification };
