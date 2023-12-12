import React, { useState, useEffect } from 'react';
import CreateWorkout from '../components/CreateWorkout';
import WorkoutForm from '../components/WorkoutForm';
import { jwtDecode } from 'jwt-decode';

function Dashboard({ token, handleLogout }) {
  const [workouts, setWorkouts] = useState([]);
  const [isWorkoutsVisible, setIsWorkoutsVisible] = useState(true);
  const [isAddWorkoutsVisible, setAddIsWorkoutsVisible] = useState(true);
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [sessionEnd, setSessionEnd] = useState(0);

  // Function to toggle the visibility
  const toggleVisibility = () => {
    fetchWorkouts(token);
    setIsWorkoutsVisible(!isWorkoutsVisible);
  };

  const toggleAddWorkout = () => {
    setAddIsWorkoutsVisible(!isAddWorkoutsVisible);
  };

  useEffect(() => {
    // Decode the token and extract the username and expiration time
    const decodedToken = jwtDecode(token);
    setUsername(decodedToken.username);
    setUserID(decodedToken.userId);
    // Fetch workouts
    fetchWorkouts(token);

    // Set up session countdown
    const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const timeRemaining = Math.max(0, expirationTime - now);
      setSessionEnd(timeRemaining);
    }, 1000);

    // Clean up countdown on component unmount
    return () => clearInterval(interval);
  }, [token]);

  async function fetchWorkouts(token) {
    try {
      const response = await fetch('http://localhost:3001/workouts', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setWorkouts(data);
      console.log(data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  const createWorkout = () => <CreateWorkout token={token} handleLogout={handleLogout} />;

  // Helper function to format time in HH:mm:ss
  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard, {username}!</p>
      <p>You have token: {token}</p>
      <p>Session Ends In: {formatTime(sessionEnd)}</p>
      <button onClick={handleLogout}>Logout</button>

      <button onClick={toggleVisibility}>Toggle Workouts</button>
      <button onClick={toggleAddWorkout}>Add workout</button>

      <div style={{ display: isWorkoutsVisible ? 'none' : 'block' }}>
        <h2>My Workouts</h2>

        {workouts.map(workout => (
          <div key={workout._id}>
            <h3>{workout.name}</h3>
            {/* Render exercise information */}
            <ul>
              {workout.exercises.map(exercise => (
                <li key={exercise._id}>
                  <h4>{exercise.exercise.name}</h4>
                  <p>Primary Muscle: {exercise.exercise.primaryMuscle}</p>
                  {/* Render series information */}
                  <ul>
                    {exercise.series.map(series => (
                      <li key={series._id}>
                        <p>Reps: {series.reps}</p>
                        <p>Weight: {series.weight}</p>
                        {/* Add more series details as needed */}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ display: isAddWorkoutsVisible ? 'none' : 'block' }}>
        <h2>Add Workout</h2>
        <WorkoutForm userId={userID} token={token}/>
      </div>
    </div>
  );
}

export default Dashboard;
