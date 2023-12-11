import React, { Component } from 'react';
import ExerciseComponent from './ExerciseComponent';

class WorkoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workout: {
        id: '',
        user_id: '',
        date: new Date(),
        notes: '',
        description: '',
      },
      exercises: [],
    };

    this.addExercise = this.addExercise.bind(this);
    this.removeExercise = this.removeExercise.bind(this);
    this.addSeries = this.addSeries.bind(this);
    this.removeSeries = this.removeSeries.bind(this);
  }

  addExercise() {
    const newExercise = {
      name: '',
      reps: '',
      weight: '',
      numSeries: 1,
      series: [
        {
          reps: '',
          effort: '',
          tillFailure: false,
        },
      ],
    };

    this.state.exercises.push(newExercise);
    this.setState({ exercises: this.state.exercises });
  }

  removeExercise(exerciseID) {
    this.state.exercises = this.state.exercises.filter(exercise => exercise.name !== exerciseID);
    this.setState({ exercises: this.state.exercises });
  }

  addSeries(exerciseID, exerciseIndex) {
    if (this.state.exercises.length > 0) {
      this.state.exercises[exerciseIndex].series.push({
        reps: '',
        effort: '',
        tillFailure: false,
      });
      this.setState({ exercises: this.state.exercises });
    }
  }

  removeSeries(exerciseID, seriesIndex, exerciseIndex) {
    this.state.exercises[exerciseIndex].series = this.state.exercises[exerciseIndex].series.filter(
      series => series.index !== seriesIndex
    );
    this.setState({ exercises: this.state.exercises });
  }

  render() {
    return (
      <div>
        <h1>Create Workout</h1>
        <div className="workout-form">
          <h2>Workout Information</h2>
          <label>Workout Name:</label>
          <input type="text" value={this.state.workout.name} onChange={(e) => {
            this.setState({ workout: { ...this.state.workout, name: e.target.value }});
          }} />

          <label>Notes:</label>
          <textarea value={this.state.workout.notes} onChange={(e) => {
            this.setState({ workout: { ...this.state.workout, notes: e.target.value }});
          }} />

          <label>Description:</label>
          <textarea value={this.state.workout.description} onChange={(e) => {
            this.setState({ workout: { ...this.state.workout, description: e.target.value }});
          }} />
        </div>
        <button type="button" onClick={this.addExercise}>Add Exercise</button>
        <div className="exercise-list">
          {this.state.exercises.map((exercise, index) => (
            <ExerciseComponent
              key={exercise.name}
              exercise={exercise}
              addExercise={this.addExercise}
              removeExercise={() => this.removeExercise(exercise.name)}
              seriesIndex={0}
              addSeries={this.addSeries}
              removeSeries={this.removeSeries}
            />
          ))}
        </div>

        <button type="button" onClick={() => {
          // TODO: Implement saving the workout
          alert('Workout created!');
        }}>Save Workout</button>
      </div>
    );
  }
}

export default WorkoutForm;
