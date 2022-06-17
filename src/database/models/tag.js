const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
    tagName: {
      type: String, 
      required: [true, "Missing tag name"]
    },
    description: {
      type: String, 
      default: "No description"
    },
    author: {
      type: mongoose.Schema.ObjectId, 
      ref: 'User'
    }, 
    createdAt:{
      type: Date, 
      default: Date.now
    },
    updatedAt: {
      type: Date, 
      default: Date.now
    },
  });

module.exports = mongoose.model('Tag', tagSchema)