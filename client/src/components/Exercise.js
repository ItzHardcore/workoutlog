import React, { useState } from 'react';
import Series from './Series';

function Exercise({ exercise, handleRemoveExercise, handleRemoveSeries }) {
  const [seriesReps, setSeriesReps] = useState('');
  const [seriesWeight, setSeriesWeight] = useState('');
  const [seriesNotes, setSeriesNotes] = useState('');
  const [seriesEffort, setSeriesEffort] = useState(1);
  const [seriesInitialPower, setSeriesInitialPower] = useState(1);
  const [seriesExecution, setSeriesExecution] = useState(1);

  // Implement the logic to add a series to the exercise
  const handleAddSeries = () => {
    // Get the data for the new series from the state variables
    const newSeries = {
      reps: parseInt(seriesReps, 10),
      weight: parseInt(seriesWeight, 10),
      notes: seriesNotes,
      effort: parseInt(seriesEffort, 10),
      initialPower: parseInt(seriesInitialPower, 10),
      execution: parseInt(seriesExecution, 10),
    };

    // Add the new series to the exercise
    // (You need to implement the logic to update the exercise state with the new series)
    // ...

    // Clear the input fields after adding a series
    setSeriesReps('');
    setSeriesWeight('');
    setSeriesNotes('');
    setSeriesEffort(1);
    setSeriesInitialPower(1);
    setSeriesExecution(1);
  };

  return (
    <div key={exercise._id} className="card mt-3">
      <div className="card-body">
        <h4 className="card-title">{exercise.exercise.name}</h4>
        <p className="card-text">Primary Muscle: {exercise.exercise.primaryMuscle}</p>

        <ul className="list-group">
          {exercise.series.map(series => (
            <Series key={series._id} series={series} handleRemoveSeries={handleRemoveSeries} />
          ))}
        </ul>

        {/* Input fields for adding a new series */}
        <div className="mb-3">
          <label className="form-label">Series Reps:</label>
          <input
            type="number"
            className="form-control"
            value={seriesReps}
            onChange={(e) => setSeriesReps(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Series Weight:</label>
          <input
            type="number"
            className="form-control"
            value={seriesWeight}
            onChange={(e) => setSeriesWeight(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Series Notes:</label>
          <textarea
            className="form-control"
            value={seriesNotes}
            onChange={(e) => setSeriesNotes(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Series Effort (1-5):</label>
          <select
            className="form-select"
            value={seriesEffort}
            onChange={(e) => setSeriesEffort(e.target.value)}
            required
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Series Initial Power (1-5):</label>
          <select
            className="form-select"
            value={seriesInitialPower}
            onChange={(e) => setSeriesInitialPower(e.target.value)}
            required
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Series Execution (1-5):</label>
          <select
            className="form-select"
            value={seriesExecution}
            onChange={(e) => setSeriesExecution(e.target.value)}
            required
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Button to add a new series */}
        <button
          type="button"
          className="btn btn-success"
          onClick={handleAddSeries}
        >
          Add Series
        </button>

        {/* ... (remove other buttons as needed) */}
      </div>
    </div>
  );
}

export default Exercise;
