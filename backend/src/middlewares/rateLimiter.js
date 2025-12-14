const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// General rate limiter for all routes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Too many requests from this IP, please try again later.'
        });
    }
});

// Stricter rate limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth routes
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later.'
    },
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (req, res) => {
        logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Too many authentication attempts, please try again later.'
        });
    }
});

// Rate limiter for sensitive operations (password reset, etc.)
const sensitiveLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 requests per hour
    message: {
        success: false,
        error: 'Too many requests for this operation, please try again later.'
    },
    handler: (req, res) => {
        logger.warn(`Sensitive operation rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Too many requests for this operation, please try again later.'
        });
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    sensitiveLimiter
};