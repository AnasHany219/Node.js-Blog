// Import the mongoose library for MongoDB interactions
const mongoose = require('mongoose');

// Define an asynchronous function to connect to the MongoDB database
const mongooseDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

// Export the mongooseDB function to be used in other parts of the application
module.exports = mongooseDB;