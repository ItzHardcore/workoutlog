import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import SessionsCards from '../components/SessionsCards';
import WorkoutsCards from '../components/WorkoutsCards';
import TimerPopup from '../components/TimerPopup';
import MeasuresTable from '../components/MeasuresTable';
import WorkoutForm from '../components/WorkoutForm';

function Dashboard({ token }) {
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [isAddWorkoutsVisible, setIsAddWorkoutsVisible] = useState(true);

  useEffect(() => {
    const decodedToken = jwtDecode(token);
    setUsername(decodedToken.username);
    setUserID(decodedToken.userId);
  }, [token]);

  const toggleAddWorkout = () => {
    setIsAddWorkoutsVisible(prev => !prev);
  };

  return (
    <div className="container mt-3">
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard, {username}!</p>

      <button className="btn btn-success ms-2 mb-2" onClick={toggleAddWorkout}>
        {isAddWorkoutsVisible ? 'Hide' : 'Add'} Workout
      </button>
      <TimerPopup />
      <SessionsCards token={token} />
      <WorkoutsCards token={token} />
      <MeasuresTable token={token} />

      {!isAddWorkoutsVisible && (
        <div className="mt-3">
          <h2>Add Workout</h2>
          <WorkoutForm userId={userID} token={token} onCancel={toggleAddWorkout} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
