// Generic file upload controller
const asyncHandler = require('express-async-handler');

// @desc    Upload a generic file
// @route   POST /api/upload
// @access  Private (any authenticated user)
exports.uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: { message: 'No file uploaded' } });
    }
    // Cloudinary storage puts the URL in req.file.path
    const fileUrl = req.file.path;
    res.status(201).json({ success: true, data: { fileUrl } });
});
