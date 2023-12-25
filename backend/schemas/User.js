const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  photo: String,
  name: String,
  username: String,
  email: String,
  phoneNumber: String,
  password: String,
  emailVerified: Boolean,
  termsAccepted: Boolean,
  role: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
