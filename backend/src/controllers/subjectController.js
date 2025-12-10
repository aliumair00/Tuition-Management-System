const Subject = require('../models/Subject');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
exports.getSubjects = async (req, res, next) => {
    try {
        res.status(200).json(res.advancedResults);
    } catch (err) {
        next(err);
    }
};

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Protected
exports.getSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id).populate('assignedTeacherId', 'name email');

        if (!subject) {
            return res.status(404).json({ success: false, error: { message: 'Subject not found' } });
        }

        res.status(200).json({
            success: true,
            data: subject
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private/Admin
exports.createSubject = async (req, res, next) => {
    try {
        const subject = await Subject.create(req.body);

        res.status(201).json({
            success: true,
            data: subject
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
exports.updateSubject = async (req, res, next) => {
    try {
        let subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({ success: false, error: { message: 'Subject not found' } });
        }

        subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: subject
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
exports.deleteSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({ success: false, error: { message: 'Subject not found' } });
        }

        await subject.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
