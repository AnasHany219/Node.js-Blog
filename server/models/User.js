// Import the mongoose library for MongoDB interactions
const mongoose = require('mongoose');

// Define the Schema constructor from mongoose
const Schema = mongoose.Schema;

// Create a new schema for the Post model
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});

// Export the Post model based on the PostSchema
module.exports = mongoose.model('User', UserSchema);