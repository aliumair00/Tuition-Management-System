const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    appName: { type: String, default: 'Edura School Platform' },
    timezone: { type: String, default: '(UTC+05:00) Islamabad, Karachi' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    passwordPolicy: {
        minLength: { type: Number, default: 8 },
        requireSpecialChar: { type: Boolean, default: false },
        requireNumber: { type: Boolean, default: false },
        forceReset: { type: Boolean, default: false }
    },
    newUserDefaults: {
        role: { type: String, default: 'Student' },
        sendWelcome: { type: Boolean, default: true },
        requireVerify: { type: Boolean, default: false }
    },
    notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
        triggers: [String]
    }
}, { timestamps: true });

// Ensure only one document exists
settingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
