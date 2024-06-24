// Import the mongoose library for MongoDB interactions
const mongoose = require('mongoose');

// Define the Schema constructor from mongoose
const Schema = mongoose.Schema;

// Create a new schema for the Post model
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Export the Post model based on the PostSchema
module.exports = mongoose.model('Post', PostSchema);