import React from 'react';


const SeriesComponent = ({
  series,
  exercise,
  exerciseID,
  index,
  removeSeries,
}) => {
  const { reps, effort, tillFailure } = series;

  return (
    <div key={index}>
      <label>Series {index + 1}:</label>
      <div className="series-details">
        <p>Reps: {reps || '-'}</p>
        <p>Effort: {effort || '-'}</p>
        <p>Till Failure? {tillFailure ? 'Yes' : 'No'}</p>

        <button type="button" onClick={() => removeSeries(exerciseID, index)}>Remove Series</button>
      </div>
    </div>
  );
};

export default SeriesComponent;
