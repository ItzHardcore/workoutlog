const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bodyPhotoSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  frontImage: String,
  backImage: String,
  leftImage: String,
  rightImage: String,
  weight: Number,
  date: Date
});

const BodyPhoto = mongoose.model('BodyPhoto', bodyPhotoSchema);

module.exports = BodyPhoto;
