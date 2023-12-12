import React, { useState } from 'react';

const WorkoutForm = () => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [seriesReps, setSeriesReps] = useState('');
  const [seriesWeight, setSeriesWeight] = useState('');
  const [seriesNotes, setSeriesNotes] = useState('');
  const [seriesEffort, setSeriesEffort] = useState('');
  const [seriesInitialPower, setSeriesInitialPower] = useState('');
  const [seriesExecution, setSeriesExecution] = useState('');

  const handleAddExercise = () => {
    const newExercise = {
      name: exerciseName,
      workoutName,
      series: [],
    };

    setExercises([...exercises, newExercise]);
    setExerciseName('');
  };

  const handleRemoveExercise = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises.splice(exerciseIndex, 1);
    setExercises(newExercises);
  };

  const handleAddSeries = (exerciseIndex) => {
    const newExercises = [...exercises];
    const newSeries = {
      reps: parseInt(seriesReps, 10),
      weight: parseInt(seriesWeight, 10),
      notes: seriesNotes,
      effort: parseInt(seriesEffort, 10),
      initialPower: parseInt(seriesInitialPower, 10),
      execution: parseInt(seriesExecution, 10),
    };

    // Add the series to the last exercise (or create a new one if there are no exercises)
    if (newExercises.length === 0 || !newExercises[newExercises.length - 1].name) {
      newExercises.push({ name: exerciseName, workoutName, series: [newSeries] });
    } else {
      newExercises[exerciseIndex].series.push(newSeries);
    }

    setExercises(newExercises);
    setSeriesReps('');
    setSeriesWeight('');
    setSeriesNotes('');
    setSeriesEffort('');
    setSeriesInitialPower('');
    setSeriesExecution('');
  };

  const handleRemoveSeries = (exerciseIndex, seriesIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].series.splice(seriesIndex, 1);
    setExercises(newExercises);
  };

  const handleSubmit = () => {
    const workoutPayload = {
      name: workoutName,
      user: 'teste',
      exercises: exercises.map((exercise) => {
        const { name, series } = exercise;
        return {
          name,
          exercise,
          series,
        };
      }),
    };
    console.log(workoutPayload);
  };

  return (
    <div>
      <h2>Workout Form</h2>
      <label>
        Workout Name:
        <input
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Exercise Name:
        <input
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />
      </label>
      <br />
      <button type="button" onClick={handleAddExercise}>
        Add Exercise
      </button>
      <br />

      {/* Display added exercises and series */}
      {exercises.map((exercise, exerciseIndex) => (
        <div key={exerciseIndex}>
          <h4>{exercise.name}</h4>
          <button type="button" onClick={() => handleRemoveExercise(exerciseIndex)}>
            Remove Exercise
          </button><br></br>
          {/* Display added series */}
          {exercise.series.map((series, seriesIndex) => (
            <div key={seriesIndex}>
              <p>{`Serie ${seriesIndex + 1}`}</p>
              <p>Reps: {series.reps}</p>
              <p>Weight: {series.weight}</p>
              <p>Notes: {series.notes}</p>
              <p>Effort: {series.effort}</p>
              <p>Initial Power: {series.initialPower}</p>
              <p>Execution: {series.execution}</p>
              <button
                type="button"
                onClick={() => handleRemoveSeries(exerciseIndex, seriesIndex)}
              >
                Remove Series
              </button>
            </div>
          ))}
          {/* Series Form */}
          <label>
            Series Reps:
            <input
              type="number"
              value={seriesReps}
              onChange={(e) => setSeriesReps(e.target.value)}
            />
          </label>
          <br />
          <label>
            Series Weight:
            <input
              type="number"
              value={seriesWeight}
              onChange={(e) => setSeriesWeight(e.target.value)}
            />
          </label>
          <br />
          <label>
            Series Notes:
            <textarea
              value={seriesNotes}
              onChange={(e) => setSeriesNotes(e.target.value)}
            />
          </label>
          <br />
          <label>
            Series Effort (1-5):
            <select
              value={seriesEffort}
              onChange={(e) => setSeriesEffort(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Series Initial Power (1-5):
            <select
              value={seriesInitialPower}
              onChange={(e) => setSeriesInitialPower(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Series Execution (1-5):
            <select
              value={seriesExecution}
              onChange={(e) => setSeriesExecution(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <br />
          <button type="button" onClick={() => handleAddSeries(exerciseIndex)}>
            Add Series
          </button>
          <br />
        </div>
      ))}
      <br />
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default WorkoutForm;
