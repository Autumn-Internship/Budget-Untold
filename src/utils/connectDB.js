const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/playlistCollections';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`)

    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;