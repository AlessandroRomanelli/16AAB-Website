const mongoose = require('mongoose');

const { Schema } = mongoose;

const CampaignSchema = new Schema({
  timestamp: {type: Number, default: Date.now},
  title: {type: String, required: true},
  content: String,
  setting: String,
  region: String,
  image: {type: Schema.Types.ObjectId, ref: 'Image'},
  screenshots: [{type: Schema.Types.ObjectId, ref: 'Image'}],
  status: { type: String, default: 'planned' }
});

mongoose.model('Campaign', CampaignSchema);
