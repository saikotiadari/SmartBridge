const mongoose = require('mongoose');

let isConnected = false;

const connectToDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookadoctor';
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = connectToDB;
