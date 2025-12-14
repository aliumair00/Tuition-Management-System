const Material = require('../models/Material');
const asyncHandler = require('express-async-handler');
const path = require('path');

// @desc    Upload new material
// @route   POST /api/materials
// @access  Private (Teacher)
exports.uploadMaterial = asyncHandler(async (req, res) => {
    const { title, description, classId, subjectId } = req.body;

    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file');
    }

    // Since we're using diskStorage, file is already saved
    // In production, upload to Cloudinary here if needed

    // Construct full URL (assumes 'uploads' is served statically)
    // NOTE: In production, use absolute URL or CDN
    const fileUrl = `/uploads/${req.file.filename}`;

    const material = await Material.create({
        title,
        description,
        classId,
        subjectId,
        fileUrl,
        fileType: path.extname(req.file.originalname),
        uploadedBy: req.user.id
    });

    res.status(201).json({ success: true, data: material });
});

// @desc    Get materials for a class
// @route   GET /api/materials/class/:classId
// @access  Private
exports.getMaterials = asyncHandler(async (req, res) => {
    const materials = await Material.find({ classId: req.params.classId })
        .populate('subjectId', 'name')
        .populate('uploadedBy', 'name');

    res.status(200).json({ success: true, data: materials });
});

// @desc    Get materials uploaded by current user
// @route   GET /api/materials/my
// @access  Private
exports.getMyMaterials = asyncHandler(async (req, res) => {
    const materials = await Material.find({ uploadedBy: req.user.id })
        .populate('classId', 'name grade section')
        .populate('subjectId', 'name')
        .sort('-createdAt');

    res.status(200).json({ success: true, count: materials.length, data: materials });
});
