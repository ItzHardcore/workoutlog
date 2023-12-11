const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, ref: 'User', required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  description: { type: String },
  exercises: [
    {
      name: { type: String, required: true },
      reps: { type: Number },
      weight: { type: Number },
      numSeries: { type: Number, required: true },
      series: [{
        reps: { type: Number },
        effort: { type: String },
        tillFailure: { type: Boolean },
      }],
    },
  ],
});


const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
  