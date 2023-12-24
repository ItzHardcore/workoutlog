const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: String,
  email: String,
  phoneNumber: String,
  password: String,
  termsAccepted: Boolean,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
