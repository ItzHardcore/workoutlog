const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSessionSchema = new Schema({
  startDate: Date,
  endDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workoutName: String,
  exercises: [
    {
      name: String, // Embed exercise name directly
      initialPower: Number,
      series: [
        {
          reps: Number,
          weight: Number,
          notes: String,
          effort: Number
        }
      ]
    },
  ],
});

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

module.exports = WorkoutSession;
