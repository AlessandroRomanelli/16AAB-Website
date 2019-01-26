// Example model

const mongoose = require('mongoose');

const { Schema } = mongoose;

const newsSchema = new Schema({
  title: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  content: {type: String, required: true},
  image: {type: String, default: ""},
  timestamp: {type: Number, default: Date.now}
});


mongoose.model('Article', newsSchema);
