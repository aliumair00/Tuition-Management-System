// Generic file upload controller
const asyncHandler = require('express-async-handler');

// @desc    Upload a generic file
// @route   POST /api/upload
// @access  Private (any authenticated user)
exports.uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: { message: 'No file uploaded' } });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, data: { fileUrl } });
});
