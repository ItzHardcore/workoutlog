const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  name: String,
  photo: String,
  initialPower: Number,
  executionVideo: String,
  primaryMuscle: String,
  secondaryMuscle: String,
  howTo: String,
  // Add any other exercise-related fields as needed
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
