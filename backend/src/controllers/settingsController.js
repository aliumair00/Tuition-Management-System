const Settings = require('../models/Settings');
const asyncHandler = require('express-async-handler');

// @desc    Get system settings
// @route   GET /api/settings
// @access  Private (Admin)
exports.getSettings = asyncHandler(async (req, res) => {
    const settings = await Settings.getSettings();
    res.status(200).json({ success: true, data: settings });
});

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private (Admin)
exports.updateSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings();
    }

    // Deep merge or specific field update
    // For simplicity, we assume req.body matches structure or specific keys
    if (req.body.appName) settings.appName = req.body.appName;
    if (req.body.timezone) settings.timezone = req.body.timezone;
    if (req.body.dateFormat) settings.dateFormat = req.body.dateFormat;

    if (req.body.passwordPolicy) {
        settings.passwordPolicy = { ...settings.passwordPolicy, ...req.body.passwordPolicy };
    }
    if (req.body.newUserDefaults) {
        settings.newUserDefaults = { ...settings.newUserDefaults, ...req.body.newUserDefaults };
    }
    if (req.body.notifications) {
        settings.notifications = { ...settings.notifications, ...req.body.notifications };
    }

    await settings.save();

    res.status(200).json({ success: true, data: settings });
});
