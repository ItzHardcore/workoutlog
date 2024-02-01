const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seriesSchema = new Schema({
  notes: String,
  reps: Number,
  weight: Number,
  effort: Number,
  execution: Number,
  type: String,
  // Add any other series-related fields as needed
});

const Series = mongoose.model('Series', seriesSchema);

module.exports = Series;