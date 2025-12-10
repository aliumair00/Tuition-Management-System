const Class = require('../models/Class');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public (or Protected based on req)
exports.getClasses = async (req, res, next) => {
    try {
        res.status(200).json(res.advancedResults);
    } catch (err) {
        next(err);
    }
};

// @desc    Get logged-in teacher's classes
// @route   GET /api/classes/my
// @access  Private (Teacher)
exports.getMyClasses = async (req, res, next) => {
    try {
        const classes = await Class.find({ teacherIds: req.user.id })
            .populate('subjectIds', 'name code')
            .populate('students', 'name email');

        res.status(200).json({
            success: true,
            data: classes
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all classes
// @route   GET /api/classes/:id
// @access  Protected
exports.getClass = async (req, res, next) => {
    try {
        const classObj = await Class.findById(req.params.id)
            .populate('teacherIds', 'name email')
            .populate('subjectIds', 'name code')
            .populate('students', 'name email');

        if (!classObj) {
            return res.status(404).json({ success: false, error: { message: 'Class not found' } });
        }

        res.status(200).json({
            success: true,
            data: classObj
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private/Admin
exports.createClass = async (req, res, next) => {
    try {
        const classObj = await Class.create(req.body);

        res.status(201).json({
            success: true,
            data: classObj
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private/Admin
exports.updateClass = async (req, res, next) => {
    try {
        let classObj = await Class.findById(req.params.id);

        if (!classObj) {
            return res.status(404).json({ success: false, error: { message: 'Class not found' } });
        }

        classObj = await Class.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: classObj
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
exports.deleteClass = async (req, res, next) => {
    try {
        const classObj = await Class.findById(req.params.id);

        if (!classObj) {
            return res.status(404).json({ success: false, error: { message: 'Class not found' } });
        }

        await classObj.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
