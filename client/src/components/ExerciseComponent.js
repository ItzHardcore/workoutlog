import React from 'react';
import SeriesComponent from './SeriesComponent';

const addSeries = (exerciseID, exerciseIndex) => {
    if (this.state.exercises.length > 0) {
      this.state.exercises[exerciseIndex].series.push({
        reps: '',
        effort: '',
        tillFailure: false,
      });
      this.setState({ exercises: this.state.exercises });
    }
  };

const ExerciseComponent = ({
  exercise,
  addExercise,
  removeExercise,
  seriesIndex,
  removeSeries,
}) => {
  const { name, reps, weight, numSeries, series } = exercise;

  return (
    <div key={name}>
      <h3>{name}</h3>

      <div className="exercise-details">
        <p>Reps: {reps || '-'}</p>
        <p>Weight: {weight || '-'}</p>
        <p>Num Series: {numSeries || '-'}</p>

        <button type="button" onClick={() => addSeries(exercise.name, seriesIndex)}>Add Series</button>

        {series.map((series, index) => (
          <SeriesComponent
            key={index}
            exercise={exercise}
            series={series}
            exerciseID={exercise.name}
            index={index}
            removeSeries={removeSeries}
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseComponent;
