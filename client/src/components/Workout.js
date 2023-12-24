import React from 'react';
import Exercise from './Exercise';

const Workout = ({ workout, onRemoveWorkout, onAddExercise, onRemoveExercise, onAddSeries, onRemoveSeries }) => {
    
  return (
    <div className="card mb-3">
      <div className="card-header">
        <h4>{workout.name}</h4>
        <button type="button" className="btn btn-danger" onClick={onRemoveWorkout}>
          Remove Workout
        </button>
      </div>
      <div className="card-body">
        {workout.exercises.map((exercise, exerciseIndex) => (
          <Exercise
            key={exerciseIndex}
            exercise={exercise}
            onRemoveExercise={() => onRemoveExercise(exerciseIndex)}
            onAddSeries={() => onAddSeries(exerciseIndex)}
            onRemoveSeries={(seriesIndex) => onRemoveSeries(exerciseIndex, seriesIndex)}
          />
        ))}
        <button type="button" className="btn btn-primary" onClick={onAddExercise}>
          Add Exercise
        </button>
      </div>
    </div>
  );
};

export default Workout;
