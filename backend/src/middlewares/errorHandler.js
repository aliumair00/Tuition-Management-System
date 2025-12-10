const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.message, { stack: err.stack, path: req.originalUrl, method: req.method });

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        error: {
            code: err.name || 'SERVER_ERROR',
            message: err.message || 'Server Error',
            details: process.env.NODE_ENV === 'production' ? null : err.stack,
        },
    });
};

module.exports = errorHandler;
