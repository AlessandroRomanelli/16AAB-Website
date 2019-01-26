// Example model

const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String,
  password: String,
  level: Number,
  displayName: String
});

UserSchema.pre('save', function (next) {
  this.displayName = this.username
  next()
})

UserSchema.virtual('timestamp')
  .get(() => this._id.getTimestamp());

mongoose.model('User', UserSchema);
