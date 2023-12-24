import React, { useState } from 'react';

function Series({ series, handleRemoveSeries }) {
  return (
    <li key={series._id} className="list-group-item">
      <div className="d-flex justify-content-between">
        <div>
          <p className="mb-1">Reps: {series.reps}</p>
          <p className="mb-1">Weight: {series.weight}</p>
          <p className="mb-1">Notes: {series.notes}</p>
        </div>
        <div>
          <p className="mb-1">Effort: {series.effort}</p>
          <p className="mb-1">Initial Power: {series.initialPower}</p>
          <p className="mb-1">Execution: {series.execution}</p>
        </div>
        <button
          type="button"
          className="btn btn-warning"
          onClick={() => handleRemoveSeries(series._id)}
        >
          Remove Series
        </button>
      </div>
    </li>
  );
}

export default Series;
