const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB..."); // Debug log
        // console.log("URI:", process.env.MONGO_URI); // Uncomment to debug URI if needed (be careful with secrets)
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`\x1b[32m%s\x1b[0m`, `MongoDB Connected: ${conn.connection.host}`); // Green
    } catch (error) {
        console.error(`\x1b[31m%s\x1b[0m`, `Error: ${error.message}`); // Red
        process.exit(1);
    }
};

module.exports = connectDB;
