const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = Schema({
  name: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  exercises: [
    {
      exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
      series: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Series' }], 
    },
  ],
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;