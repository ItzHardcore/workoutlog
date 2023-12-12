const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSessionSchema = Schema({
  startDate: Date,
  endDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workout: { type: mongoose.Schema.Types.ObjectId, ref:'Workout'}
});

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

module.exports = WorkoutSession;