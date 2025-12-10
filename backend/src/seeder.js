const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const users = require('./data/users'); // removed unused import
const User = require('./models/User');
const Class = require('./models/Class');
const Subject = require('./models/Subject');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Import into DB
const importData = async () => {
    try {
        // Create default admin if not exists
        const adminExists = await User.findOne({ email: 'admin@school.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: 'admin@school.com',
                password: 'password123',
                role: 'Admin',
                active: true
            });
            console.log('Admin User Created...');
        } else {
            console.log('Admin already exists...');
        }

        console.log('Data Imported...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Class.deleteMany();
        await Subject.deleteMany();
        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else {
    console.log('Please use -i to import (seed admin) or -d to destroy data');
    process.exit();
}
