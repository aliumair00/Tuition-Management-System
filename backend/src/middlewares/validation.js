const Joi = require('joi');

// Validation schemas
const schemas = {
    // User registration
    register: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(128).required(),
        role: Joi.string().valid('Admin', 'Teacher', 'Student', 'Parent').required(),
        phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
        address: Joi.string().max(200).optional()
    }),

    // User login
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    // Update user profile
    updateProfile: Joi.object({
        name: Joi.string().min(2).max(50).optional(),
        phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
        address: Joi.string().max(200).optional(),
        notificationPreferences: Joi.object({
            email: Joi.boolean().optional(),
            sms: Joi.boolean().optional(),
            app: Joi.boolean().optional()
        }).optional()
    }),

    // Create class
    createClass: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        subjectId: Joi.string().hex().length(24).required(),
        teacherId: Joi.string().hex().length(24).required(),
        schedule: Joi.object({
            day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
            startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
        }).required(),
        maxStudents: Joi.number().integer().min(1).max(50).optional()
    }),

    // Create exam
    createExam: Joi.object({
        title: Joi.string().min(3).max(100).required(),
        subjectId: Joi.string().hex().length(24).required(),
        classId: Joi.string().hex().length(24).required(),
        date: Joi.date().iso().required(),
        duration: Joi.number().integer().min(30).max(300).required(),
        totalMarks: Joi.number().integer().min(1).max(200).required(),
        description: Joi.string().max(500).optional()
    }),

    // Create result
    createResult: Joi.object({
        studentId: Joi.string().hex().length(24).required(),
        examId: Joi.string().hex().length(24).required(),
        marksObtained: Joi.number().min(0).required(),
        totalMarks: Joi.number().min(1).required(),
        grade: Joi.string().valid('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F').optional(),
        remarks: Joi.string().max(200).optional()
    })
};

// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: errorMessage
                }
            });
        }
        next();
    };
};

// Middleware to validate request body against a schema
const validateRequest = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Validation schema not found'
                }
            });
        }
        
        const { error, value } = schema.validate(req.body);
        
        if (error) {
            const errorMessage = error.details.map(detail => {
                // Clean up the error message
                return detail.message.replace(/"/g, '');
            }).join(', ');
            
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: errorMessage,
                    details: error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message.replace(/"/g, '')
                    }))
                }
            });
        }
        
        // Replace req.body with validated and sanitized data
        req.body = value;
        next();
    };
};

module.exports = {
    validate,
    validateRequest,
    schemas
};