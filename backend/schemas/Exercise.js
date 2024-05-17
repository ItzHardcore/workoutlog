const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  name: String,
  photo: String,
  executionVideo: String,
  primaryMuscle: String,
  secondaryMuscle: String,
  howTo: String,
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
