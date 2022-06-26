const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema({
    tagName: {
      type: String, 
      required: [true, "Missing tag name"]
    },
    user: {
      type: mongoose.Schema.ObjectId, 
      required: [true, "Missing User"]
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

module.exports = mongoose.model('Favorite', favoriteSchema)