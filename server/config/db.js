const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use local MongoDB without SSL
        const conn = await mongoose.connect('mongodb://localhost:27017/plant_dispatch', {
            serverSelectionTimeoutMS: 5000,
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📁 Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.log('\n💡 Make sure MongoDB is running:');
        console.log('   Run: mongod --dbpath C:\\data\\db');
        process.exit(1);
    }
};

module.exports = connectDB;