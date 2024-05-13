import React, { useState } from 'react';

const WorkoutsModal = ({ onClose, workouts, handleStartWorkoutFromModal }) => {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');

  const handleStart = () => {
    if (selectedWorkoutId) {
      handleStartWorkoutFromModal(selectedWorkoutId);//Call the function passed as props
      onClose();//Close the modal
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Choose a Workout</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <select value={selectedWorkoutId} onChange={(e) => setSelectedWorkoutId(e.target.value)} className="form-select">
              <option value="">Select a workout</option>
              {workouts.map(workout => (
                <option key={workout._id} value={workout._id}>{workout.name}</option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleStart}>Start</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutsModal;
