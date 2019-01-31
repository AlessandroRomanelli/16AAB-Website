// Example model

const mongoose = require('mongoose');

const { Schema } = mongoose;

const ImageSchema = new Schema({
  path: String,
  pathMin: String,
  timestamp: {type: Number, default: Date.now},
  title: String,
  description: String
});

mongoose.model('Image', ImageSchema);
