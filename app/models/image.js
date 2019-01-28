// Example model

const mongoose = require('mongoose');

const { Schema } = mongoose;

const ImageSchema = new Schema({
  path: String,
  timestamp: {type: Number, default: Date.now},
  title: String,
  description: String
});

mongoose.model('Image', ImageSchema);
