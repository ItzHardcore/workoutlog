const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measureSchema = new Schema({
  weight: Number,
  steps: Number,
  sleepHours: Number,
  energy: { type: Number, min: 1, max: 5 },
  hunger: { type: Number, min: 1, max: 5 },
  stress: { type: Number, min: 1, max: 5 },
  date: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Measure = mongoose.model('Measure', measureSchema);

module.exports = Measure;
